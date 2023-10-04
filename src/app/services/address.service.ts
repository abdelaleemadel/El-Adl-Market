import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private _HttpClient: HttpClient) { }
  headers: any = {
    token: JSON.parse(localStorage.getItem('userToken')!),
  };
  getAddresses(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      headers: this.headers,
    });
  }
  addAddress(addAddressFrom: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/addresses`, addAddressFrom, { headers: this.headers })
  }
}
