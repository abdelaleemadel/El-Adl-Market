import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _HttpClient: HttpClient) { }
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
}
