import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  addressData: BehaviorSubject<any> = new BehaviorSubject('');
  headers: any;

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {
    this._AuthService.userData.subscribe((response) => {
      if (response) {
        this.headers = { token: response };
      }
    })
  }
  getAddresses(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      headers: this.headers,
    });
  }
  addAddress(addAddressFrom: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/addresses`, addAddressFrom, { headers: this.headers })
  }
}
