import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnChanges {
  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute, private _WishlistService: WishlistService, private _CartService: CartService) { }
  productDetails: any;
  wishlistIds: any;
  id: any;
  seeMore: boolean = false;
  @Input() productId: string = '';
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    })

    if (this.id) {
      this.displayProductDetails(this.id)
    }
    this.getWishlist()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['productId']['firstChange']) {
      this.id = changes['productId']['currentValue'];
      if (this.id) {
        this.displayProductDetails(this.id)
      }
    }
  }
  getProductDetails(id: string): void {

    this._ProductService.getProductDetails(id).subscribe({
      next: (response) => {
        this.productDetails = response.data;
      },
      error: (err) => console.log(err)
    })
  }
  /* Display specific product's details */
  displayProductDetails(productId: string): void {
    this._ProductService.allProducts.subscribe({
      next: (response) => {
        if (response.length) {
          this.findProductDetails(response, this.id);
        } else {
          this.getProductDetails(this.id);
        }
      }
    })
  }
  findProductDetails(products: any[], id: string) {

    this.productDetails = (products.filter((product) => product['_id'] == id))[0];

  }
  addItem(id: string, event: Event): void {
    this._ProductService.addItem(id, event);
  }
  removeItem(id: string, event: Event): void {
    this._ProductService.removeItem(id, event);
  }
  seeMoreFn() {
    this.seeMore = true;
  }
  seeLessFn() {
    this.seeMore = false
    console.log(this.seeMore);
  }
  getWishlist(): void {
    this._WishlistService.wishlistIds.subscribe({
      next: response => {
        this.wishlistIds = response
      },
      error: err => { console.log(err) }
    })
  }
  /* Add new product to the wishlist and show solid heart in product-details component */
  addToWishlist(productId: string, event: Event): void {
    this.toggleElement(event);

    this._WishlistService.addToWishlist(productId).subscribe({
      next: response => {
        this.wishlistIds = response.data;
        this.toggleElement(event);

        this._WishlistService.wishlistIds.next(response.data)
      },
      error: err => {
        this.toggleElement(event);
        ; console.log(err)
      }
    })
  }

  /* remove a product From the wishlist and show hollow heart in product-details component */
  removeFromWishlist(productId: string, event: Event): void {
    this.toggleElement(event);

    this._WishlistService.removeFromWishlist(productId).subscribe({
      next: response => {
        this.toggleElement(event);
        this.wishlistIds = response.data;
        this._WishlistService.wishlistIds.next(response.data)
      },
      error: err => {
        this.toggleElement(event);
        console.log(err)
      }
    })
  }
  /* Get the user's cart from the api to display it */
  getCart(): void {
    this._CartService.getCart().subscribe({
      next: (response) => {
        this._CartService.cartData.next(response.data)
      },
      error: (err) => console.log(err),
    });
  }
  addToCart(productId: string): void {
    this.triggerCart();
    this._CartService.addToCart(productId).subscribe({
      next: () => {
        this.getCart();
      },
      error: (err) => console.log(err),
    });
  }
  /* Add product with specific number */
  addtoCartDetails(productId: string, event: Event): void {
    let input = $(event.target!).siblings('.data').find('input[title="count"]');
    let value = input.val();
    if (Number(value) == 1) {
      this.addToCart(productId);

    } else if (Number(value) > 1) {
      let count: string = String(value);
      this.triggerCart();
      this._CartService.addToCart(productId).subscribe({
        next: () => {
          this._CartService.updateCart(productId, count).subscribe({
            next: (response) => this._CartService.cartData.next(response.data),
            error: (err) => console.log(err)
          })
        },
        error: (err) => { console.log(err) }
      })

    }
  }
  /* Open thecart Canvas */
  triggerCart(): void {
    this._CartService.triggerCart()
  }
  /* Toggle (display:none) from an element and the one above it {For the loadind during adding/removing from wishlist} */
  toggleElement(event: Event) {
    if (event.target) {
      $(event.target).prev().toggleClass('d-none')
      $(event.target).toggleClass('d-none');
    }
  }

  /* Close the product details modal while adding element to cart to show the cart canvas*/
  closeDetailsModal(): void {
    this._ProductService.closeDetailsModal();
  }
}
