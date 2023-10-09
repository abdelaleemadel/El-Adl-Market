import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData = new BehaviorSubject('');
  decodedUserData = new BehaviorSubject(null)
  constructor(private _HttpClient: HttpClient) {
    let token = localStorage.getItem('userToken')
    if (token) {
      console.log(token);
      token = JSON.parse(token);
      this.userData.next(token!);
      let decodedToken: any = jwtDecode(token!);
      this.decodedUserData.next(decodedToken);
    }

  }

  register(registerForm: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, registerForm)
  }
  login(loginForm: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, loginForm)
  }

}
