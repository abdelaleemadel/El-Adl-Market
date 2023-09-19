import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private _HttpClient:HttpClient) { }
  register(registerForm:any):Observable<any>{
   return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, registerForm)
  }
}
