import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  constructor(private _HttpClient: HttpClient) { }
  /* Forget password api to get a reset password code */
  fogetPassword(email: object): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`, email)
  }

  /* Confirms the reset code sent to Email */
  resetCode(code: object): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`, code)
  }


  /* Reset The new Password */
  resetPassword(body: object): Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/auth/resetPassword`, body)
  }
}
