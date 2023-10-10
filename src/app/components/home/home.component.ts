import { Component, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { error, get, param } from 'jquery';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit/* , OnChanges *//* , DoCheck */ {
  allProductss: any;
  loggedUser: boolean = false;
  wishlistIds: any[] = [];
  productId: string = '';
  categoryId: string = '';
  subCategoryId: string = '';
  brandId: string = '';
  i: number = 0;
  page: number = 0;
  isSubCatEmpty: boolean = false;
  isEmpty: boolean = false;
  isCatEmpty: boolean = false;
  constructor(
    private _ProductService: ProductsService,
    private _CartService: CartService,
    private _WishlistService: WishlistService,
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService
  ) { }
  ngOnInit(): void {
    /* Check if the user is logged in */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.loggedUser = true;
        }
      }
    )


    /* Check if there're parameters  */
    this._ActivatedRoute.paramMap.subscribe((param) => {
      if (param.keys.length != 0) {
        this.routeParameters();
      } else {
        this.brandId = '';
        this.categoryId = '';
        this.subCategoryId = '';
        this.isEmpty = false;
        this.isCatEmpty = false;
        this.isSubCatEmpty = false;
        this.getProducts()
      }
    })


    /* Get products  to display them*/
    this._ProductService.allProducts.subscribe({
      next: (response) => {
        this.allProductss = response;
      },
    });

    /* get the wishlist in order to display the "hearts" correctly  */
    this._WishlistService.wishlistIds.subscribe({
      next: response => {
        this.wishlistIds = response
      },
      error: err => { console.log(err) }
    })

  }
  /* Call products from api if they're not already here  */
  getProducts(): void {
    this.page = 0;
    this._ProductService.getProducts().subscribe({
      next: (response) => {
        this.allProductss = response.data.reverse();
        this._ProductService.getProducts(`?page=2`).subscribe({
          next: (response) => {
            this.allProductss.unshift(...response.data.reverse());
            this.allProductss = this.allProductss;
            this._ProductService.allProducts.next(this.allProductss);
          },
        });
      },
      error: (err) => console.log(err),
    });
  }
  /* Add product to cart when pressing the shopping icon in home */
  addToCart(productId: string): void {
    this.triggerCart();
    if (this.loggedUser) {
      this._CartService.addToCart(productId).subscribe({
        next: () => {
          this.getCart();
        },
        error: (err) => console.log(err),
      });
    }
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

  /* Add new product to the wishlist and show solid heart in the home */
  addToWishlist(productId: string, event: Event): void {
    if (this.loggedUser) {
      this._WishlistService.addToWishlist(productId, event)
    }
  }
  /* remove a product From the wishlist and show hollow heart in home component */
  removeFromWishlist(productId: string, event: Event): void {
    if (this.loggedUser) {
      this._WishlistService.removeFromWishlist(productId, event);
    }
  }


  /* Open the OffCanvas Cart (from NavBar component)*/
  triggerCart(): void {
    this._CartService.triggerCart();
  }

  /* Get Product Id and store it in order to open product details */
  getProductId(productId: string): void {
    this.productId = productId;
  }
  /* Find if there's any parameters to use them in Showing products */
  routeParameters(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.categoryId = '';
      this.brandId = '';
      this.subCategoryId = '';
      if (param.get('brand')) {
        this.brandId = param.get('brand')!;
        this.getBrandProducts();
      } else if (param.get('category')) {
        this.categoryId = param.get('category')!;
        this.getCatProducts();
      } else if (param.get('subcategory')) {
        this.subCategoryId = param.get('subcategory')!;
        this.getSubCatProducts();
      }
    })
  }
  /* Get the brand By product */
  getBrandProducts(): void {
    this.page = 0;
    if (this.brandId) {
      this._ProductService.getProducts(`?brand=${this.brandId}`).subscribe({
        next: response => {
          this._ProductService.allProducts.next(response.data);
          if (response.results == 0) {
            this.isEmpty = true
          } else { this.isEmpty = false }
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  /* Get Category's products */
  getCatProducts(): void {
    this.page = 0;
    if (this.categoryId) {
      this._ProductService.getProducts(`?category=${this.categoryId}`).subscribe({
        next: response => {
          this._ProductService.allProducts.next(response.data);
          if (response.results == 0) {
            this.isCatEmpty = true
          } else { this.isCatEmpty = false }
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  /* Get Sub-Category's products */
  getSubCatProducts(): void {
    this.page = 0;
    if (this.subCategoryId) {
      this._ProductService.getProducts(`?subcategory=${this.subCategoryId}`).subscribe({
        next: response => {
          this._ProductService.allProducts.next(response.data);
          if (response.results == 0) {
            this.isSubCatEmpty = true
          } else { this.isSubCatEmpty = false }
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }


}
