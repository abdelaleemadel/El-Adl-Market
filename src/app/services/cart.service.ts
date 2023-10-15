import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  cartData: BehaviorSubject<any> = new BehaviorSubject('');
  headers: any;

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this._AuthService.userData.subscribe((response) => {
      if (response) {
        this.headers = { token: response };
        this.storeCart();
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

  /* Store the cart data in the Behaviour subject */
  storeCart(): void {
    this.getCart().subscribe({
      next: (response) => {
        this.cartData.next(response.data);
      },
      error: (err) => {
        if (err.statusText != "Not Found") {
          this.cartData.next('error');
          this.toastr.error(err.error.message || err.statusText, `Cart  ` + (err.error.statusMsg || err.name));
        } else {
          this.cartData.next({ products: [] })
        }
      },
    });
  }
}



