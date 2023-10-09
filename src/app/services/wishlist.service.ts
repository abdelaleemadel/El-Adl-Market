import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistIds: BehaviorSubject<any> = new BehaviorSubject('');
  headers: any;

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {

    this._AuthService.userData.subscribe((response) => {
      if (response) {
        this.headers = { token: response };
        this.storeWishlist();
      } else { this.wishlistIds.next('') }
    })
  }

  /* Get the logged user wishlist data*/
  getWishlist(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      headers: this.headers,
    });
  }
  /* Add a product to the user's wishlist */
  addToWishlistApi(productId: string): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/wishlist`, { productId: productId }, {
      headers: this.headers,
    });
  }
  /* Remove a product from the user's wishlist */
  removeFromWishlistApi(productId: string): Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      headers: this.headers,
    });
  }
  /* Store the products' ids of the wishlist */
  storeWishlist(): void {
    this.getWishlist().subscribe({
      next: response => {
        let ids = response.data.map((product: { _id: any; }) => product._id);
        this.wishlistIds.next(ids)
      },
      error: err => { console.log(err) }
    })
  }
  /* to add to wishlist from one place only */
  triggerAddWishList(productId: string): void {
    const addIcon = $(`#s${productId}`);
    console.log(addIcon);
  }


  /* Add new product to the wishlist and show solid heart in the home/productdetail */
  addToWishlist(productId: string, event: Event): void {
    this.toggleElement(event);
    this.addToWishlistApi(productId).subscribe({
      next: response => {
        this.toggleElement(event);
        this.wishlistIds.next(response.data)
      },
      error: err => {
        console.log(err);
        this.toggleElement(event);
      }
    })

  }
  /* remove a product From the wishlist and show hollow heart in home/productdetails component */
  removeFromWishlist(productId: string, event: Event): void {
    this.toggleElement(event);
    this.removeFromWishlistApi(productId).subscribe({
      next: response => {
        this.toggleElement(event);
        this.wishlistIds.next(response.data)
      },
      error: err => {
        this.toggleElement(event);
        console.log(err)
      }
    })
  }
  /* Toggle (display:none) from an element and the one above it {For the loadind during adding/removing from wishlist} */
  toggleElement(event: Event) {
    if (event.target) {
      $(event.target).prev().toggleClass('d-none')
      $(event.target).toggleClass('d-none');
    }
  }
}
