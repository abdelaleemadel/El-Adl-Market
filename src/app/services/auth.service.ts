import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData = new BehaviorSubject('');
  decodedUserData = new BehaviorSubject(null);
  searchWord = new BehaviorSubject('');
  token: any;
  constructor(private _HttpClient: HttpClient) {
    this.userData.subscribe(
      response => {
        if (response) {
          this.token = response;
          this.token = response
        } else if (localStorage.getItem('userToken')) {
          this.token = localStorage.getItem('userToken')
          this.userData.next(this.token);
        }

        if (this.token) {
          let decodedToken: any = jwtDecode(this.token);
          this.decodedUserData.next(decodedToken);
        }
      }
    )

  }

  register(registerForm: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, registerForm)
  }
  login(loginForm: any): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, loginForm)
  }

}
