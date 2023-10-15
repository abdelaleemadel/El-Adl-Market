import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
ToastrService
@Injectable({
  providedIn: 'root'
})
export class AddressService {

  addressData: BehaviorSubject<any> = new BehaviorSubject('');
  headers: any;

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService, private toastr: ToastrService) {
    this._AuthService.userData.subscribe((response) => {
      if (response) {
        this.headers = { token: response };
        this.getAddresses();
      }
    })
  }
  getAddressesApi(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      headers: this.headers,
    });
  }
  addAddress(addAddressFrom: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/addresses`, addAddressFrom, { headers: this.headers })
  }

  /* API FOR REMOVING ADDRESS */
  removeAddress(addressId: string): Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`, { headers: this.headers })
  }
  /* call the api and store the addresses in BS */
  getAddresses(): void {
    this.getAddressesApi().subscribe({
      next: response => { this.addressData.next(response.data) },
      error: err => {
        this.addressData.next('error');
        this.toastr.error(err.error.message || err.statusText, `Addresses  ` + (err.error.statusMsg || err.name));
      }
    })
  }
}
