import { Component, OnInit, OnChanges, SimpleChanges, DoCheck, Input, SimpleChange } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit, OnChanges {
  @Input() brandProducts: any;
  @Input() subcategoryProducts: any;
  @Input() categoryProducts: any;
  @Input() wishlistProducts: any;
  total: number = 20;
  wishList: any; allProductss: any; wishlistIds: any[] = [];
  productId: string = ''; message: string = ''; searchWord: string = '';
  page: number = 0;
  loggedUser: boolean = false; isEmpty: boolean = false; isHome: boolean = false; isWishlist: boolean = false;
  constructor(
    private _ProductService: ProductsService, private _CartService: CartService,
    private _WishlistService: WishlistService, private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService, private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    /* Check if the user is logged in */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) { this.loggedUser = true } else { this.loggedUser = false }
      }
    )
    /* Check wether they're any parameters or not */
    this.checkParameters();

    /* get the wishlist in order to display the "hearts" correctly  */
    this._WishlistService.wishlistIds.subscribe(response => {
      this.wishlistIds = response;
    })
    /* Get the search Word */
    this.getSearchWord();
  }

  /* Check if there're parameters  */
  checkParameters(): void {
    let parameters: any[] = [];
    this._ActivatedRoute.paramMap.subscribe(
      response => {
        parameters = response.keys;
        console.log(parameters);

        if (parameters.length == 0) {
          this.spinner.show();
          this.compareProducts();
          this.isHome = true;
        } else {
          this.isHome = false;
        }
      })
  }

  /* Comapare this products with the behaviour subject */
  compareProducts(): void {
    this.page = 1;
    this._ProductService.allProducts.subscribe(
      response => {
        if (response) {
          this.spinner.hide();
          if (Array.isArray(response) && !(Array.isArray(this.allProductss) && (this.allProductss.join('') == response.join('')))) {
            this.allProductss = response;
          }
        }
      }
    )
  }

  /* Showing brand Products */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isHome) {
      this.displayChanges(changes);
    }
  }

  displayChanges(changes: SimpleChanges): void {
    this.page = 0;
    let changed = Object.keys(changes)[0];
    (changed == 'wishlistProducts') ? this.isWishlist = true : this.isWishlist = false;
    let value = changes[changed]['currentValue'];
    if (value) {
      if (value.length == 0) {
        this.isEmpty = true;
        this.message = `This ${changed[0].toUpperCase()}${changed.slice(1, -8)} has No Products yet.`;
      } else {
        this.isEmpty = false; this.allProductss = value;
      }
    }
  }


  /* Add product to cart when pressing the shopping icon in home */
  addToCart(productId: string): void {
    if (this.loggedUser) {
      this.spinner.show();
      this._CartService.addToCart(productId).subscribe({
        next: () => {
          this.getCart();
        },
        error: (err) => { this.afterError(err) }
      });
    } else { this.triggerCart() }
  }

  /* Get the user's cart from the api to display it */
  getCart(): void {
    this._CartService.getCart().subscribe({
      next: (response) => {
        this._CartService.cartData.next(response.data);
        this.spinner.hide();
        this.triggerCart();
      },
      error: (err) => {
        this.afterError(err)
      }
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

  /* get The search word */
  getSearchWord(): void {
    this._AuthService.searchWord.next('');
    this._AuthService.searchWord.subscribe(response => {
      this.page = 0;
      this.searchWord = response;
    })
  }
  /* Actions to happen when error occurs */
  afterError(err: any): void {
    this.spinner.hide(); this.toastr.error(err.error.message || err.statusText, (err.error.statusMsg || err.name));

  }
}


