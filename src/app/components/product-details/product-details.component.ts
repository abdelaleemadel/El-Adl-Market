import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnChanges {
  constructor(private _ProductService: ProductsService, private _ActivatedRoute: ActivatedRoute, private _WishlistService: WishlistService, private _CartService: CartService,
    private _AuthService: AuthService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }
  productDetails: any;
  wishlistIds: any;
  loggedUser: boolean = false;
  id: any;
  seeMore: boolean = false;
  @Input() productId: string = '';
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.displayProductDetails(this.id)
      }
    })

    /* Check if the user is logged in */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.loggedUser = true;
        }
      }
    )

    /* get the wishlist in order to display the "hearts" correctly  */
    this._WishlistService.wishlistIds.subscribe({
      next: response => {
        this.wishlistIds = response
      },
      error: err => { console.log(err) }
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['productId']['firstChange']) {
      this.id = changes['productId']['currentValue'];
      if (this.id) {
        this.displayProductDetails(this.id)
      }
    }
  }

  /* Display specific product's details */
  displayProductDetails(productId: string): void {
    this._ProductService.allProducts.subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length) {
          this.findProductDetails(response, this.id);
        } else {
          this.getProductDetails(this.id);
        }
      }
    })
  }
  /* Search for a specific product in the BS allproducts and display it */
  findProductDetails(products: any[], id: string) {
    this.productDetails = (products.filter((product) => product['_id'] == id))[0];
  }

  /* Get a specific product from the api */
  getProductDetails(id: string): void {
    this.spinner.show();
    this._ProductService.getProductDetails(id).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.productDetails = response.data;
      },
      error: (err) => this.afterError(err)
    })
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

  /* Add new product to the wishlist and show solid heart in product-details component */
  addToWishlist(productId: string, event: Event): void {
    if (this.loggedUser) {
      this._WishlistService.addToWishlist(productId, event)
    }
  }

  /* remove a product From the wishlist and show hollow heart in product-details component */
  removeFromWishlist(productId: string, event: Event): void {
    if (this.loggedUser) {
      this._WishlistService.removeFromWishlist(productId, event);
    }
  }

  /* Get the user's cart from the api to display it */
  getCart(): void {
    this._CartService.getCart().subscribe({
      next: (response) => {
        this._CartService.cartData.next(response.data);
        this.spinner.hide();
        this.triggerCart();
      },
      error: (err) => this.afterError(err),
    });
  }

  addToCart(productId: string): void {
    if (this.loggedUser) {
      this._CartService.addToCart(productId).subscribe({
        next: () => {
          this.getCart();
        },
        error: (err) => this.afterError(err),
      });
    }
  }

  /* Add product with specific number */
  addtoCartDetails(productId: string, event: Event): void {
    if (this.loggedUser) {
      this.spinner.show();
      let input = $(event.target!).siblings('.data').find('input[title="count"]');
      let value = input.val();
      if (Number(value) == 1) {
        this.addToCart(productId);
      } else if (Number(value) > 1) {
        let count: string = String(value);
        this._CartService.addToCart(productId).subscribe({
          next: () => {
            this._CartService.updateCart(productId, count).subscribe({
              next: (response) => { this._CartService.cartData.next(response.data); this.spinner.hide(); this.triggerCart() },
              error: (err) => { this.afterError(err) }
            })
          },
          error: (err) => { this.afterError(err) }
        })
      } else { this.spinner.hide() }
    } else { this.triggerCart() }
  }
  /*Close the details Modal if opened and  Open thecart Canvas */
  triggerCart(): void {
    this._ProductService.closeDetailsModal();

    this._CartService.triggerCart();
  }


  afterError(err: any) {
    this.spinner.hide();
    this.toastr.error(err.error.message || err.statusText, (err.error.statusMsg || err.name));
  }
}
