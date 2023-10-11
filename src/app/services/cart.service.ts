import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})

export class CartService {
  cartData: BehaviorSubject<any> = new BehaviorSubject('');
  headers: any;

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {
    this._AuthService.userData.subscribe((response) => {
      if (response) {
        this.headers = { token: response };
      } else { this.headers = null; }
    })
  }


  addToCart(productId: string): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/cart`,
      { productId: productId },
      { headers: this.headers }
    );
  }

  getCart(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: this.headers,
    });
  }
  updateCart(id: string, count: string): Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, { count: count }, { headers: this.headers })
  }
  removeItem(id: string): Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, { headers: this.headers })
  }
  /* Open the cart Canvas */
  triggerCart(): void {
    const cartCanvas = $('div[data-bs-target="#cartoffcanvasExample"]');
    cartCanvas.trigger("click")
  }
  closeCartCanvas(): void {
    const closeCartCanvas = $('button[data-bs-dismiss="offcanvas"]');
    closeCartCanvas.trigger("click");
  }
}


/* <i class="fa-solid fa-bag-shopping mx-2 pointer-cursor" data-bs-toggle="offcanvas"
data-bs-target="#navoffcanvasExample" aria-controls="navoffcanvasExample"></i> */
