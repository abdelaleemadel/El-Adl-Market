import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistIds: BehaviorSubject<any> = new BehaviorSubject('');
  constructor(private _HttpClient: HttpClient) {
    this.storeWishlist();
  }
  headers: any = {
    token: JSON.parse(localStorage.getItem('userToken')!),
  };
  /* Get the logged user wishlist data*/
  getWishlist(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      headers: this.headers,
    });
  }
  /* Add a product to the user's wishlist */
  addToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/wishlist`, { productId: productId }, {
      headers: this.headers,
    });
  }
  /* Remove a product from the user's wishlist */
  removeFromWishlist(productId: string): Observable<any> {
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
}
