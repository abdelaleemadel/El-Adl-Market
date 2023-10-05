import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) { }
  userId = new BehaviorSubject('');
  headers: any = {
    token: JSON.parse(localStorage.getItem('userToken')!),
  };
  createCashOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      shippingAddress,
      { headers: this.headers })
  }
  checkOutOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      shippingAddress,
      { headers: this.headers })
  }
  /* Get to user Id from the token to get the orders*/
  getUserId(): void {
    this._AuthService.decodedUserData.subscribe({
      next: (response) => {
        if (response) {
          this.userId.next(response['id']);
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }
  /* Get the orders */
  getUserOrders(): Observable<any> {
    this.getUserId();
    console.log(this.userId.value);
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${this.userId.value}`)



  }
}
