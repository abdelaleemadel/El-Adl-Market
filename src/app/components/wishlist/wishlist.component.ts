import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from 'src/app/services/wishlist.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any;
  isWishListEmpty: boolean = false;
  loggedUser: boolean = false;
  constructor(private _WishlistService: WishlistService, private spinner: NgxSpinnerService, private _AuthService: AuthService, private _Router: Router) {
    this.spinner.show()
  }
  ngOnInit(): void {
    /*Check if user is logged in  */
    this._AuthService.userData.subscribe(
      (response) => {
        if (response) {
          this.getWishList()
          this.loggedUser = true;
        } else {
          this.loggedUser = false; this._Router.navigate(['/home']); this.spinner.hide();
        }
      }
    )
  }


  /* Get and Display Wishlist in Home */
  getWishList(): void {
    this._WishlistService.wishList.subscribe(
      (response) => {
        this.wishlistProducts = response;
        this.spinner.hide();
      }
    )
  }
}
