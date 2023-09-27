import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
userData = new BehaviorSubject('');
  constructor(private _HttpClient:HttpClient) {
    let token = localStorage.getItem('userToken')
    if(token){
      this.userData.next(token);
    }

  }

  register(registerForm:any):Observable<any>{
   return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, registerForm)
  }
  login(loginForm:any):Observable<any>{
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, loginForm)
   }

}
