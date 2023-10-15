import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { matchPassword } from 'src/app/match-password.validator';
import { AuthService } from 'src/app/services/auth.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  constructor(private _UserdataService: UserdataService, private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }
  isLoading: boolean = false;
  isForgetPassword: boolean = true;
  isResetCode: boolean = false;
  isResetPassword: boolean = false;
  statusMessage: string = '';
  failureMessage: string = '';
  email: string = ''

  /* Email Form */
  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  })
  /* Reset Code form */
  resetCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+/)])
  })
  /* Reset New Password */
  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,10}$/)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,10}$/)])
  }, { validators: matchPassword })
  /* send email to get reset Code */
  forgetPassword(forgetPasswordForm: FormGroup): void {
    this.isLoading = true;
    this.spinner.show();

    if (forgetPasswordForm.valid) {
      this._UserdataService.fogetPassword(forgetPasswordForm.value).subscribe({
        next: (response) => {
          this.email = forgetPasswordForm.value.email;
          this.removeError();
          this.spinner.hide();
          this.toastr.success(`${response.message}`, ` ${response.statusMsg}`);
          this.isForgetPassword = false;
          this.isResetCode = true;
        },
        error: (err) => {
          this.afterError(err);
          this.statusMessage = err.error.statusMsg;
          this.failureMessage = err.error.message.split(" ").slice(0, 9).join(" ");
          this.isLoading = false;
        }
      })
    } else { this.spinner.hide() }
  }

  /* Verify the Reset Code*/
  resetCode(resetCodeForm: FormGroup): void {
    this.isLoading = true;
    this.spinner.show();
    if (resetCodeForm.status == 'VALID') {
      this._UserdataService.resetCode(resetCodeForm.value).subscribe({
        next: (response) => {
          this.removeError();

          this.isResetCode = false;
          this.isResetPassword = true;
          this.spinner.hide();
        },
        error: (err) => {
          this.afterError(err);
          this.addError(err);
        }
      })
    } else { this.spinner.hide() }
  }


  /* Reset The new Password */
  resetPassword(resetPasswordForm: FormGroup): void {
    this.isLoading = true;
    this.spinner.show();
    if (resetPasswordForm.status == 'VALID') {
      let resetPassword = { "email": this.email, "newPassword": resetPasswordForm.value.password };
      this._UserdataService.resetPassword(resetPassword).subscribe({
        next: response => {
          this.removeError();
          this.spinner.hide();
          this.isResetPassword = false;
          this.isForgetPassword = true;
          console.log(response);

          localStorage.setItem('userToken', response.token);
          this._AuthService.userData.next(response.token);
          this._Router.navigate(['/home'])
        },
        error: err => {
          this.afterError(err);
          this.addError(err)
        }
      })
    } else { this.spinner.hide() }
  }

  /* Remove the error parargraph comes from api  */
  removeError(): void {
    this.isLoading = false;
    this.statusMessage = '';
    this.failureMessage = '';
  }
  /* Add an Error Parahraph in case there's an error from API */
  addError(err: any): void {
    this.statusMessage = err.error.statusMsg;
    this.failureMessage = err.error.message.split(" ").slice(0, 9).join(" ");
    this.isLoading = false;
  }

  /* After Error for things happens after error from api*/
  afterError(err: any): void {
    this.spinner.hide();
    this.toastr.error(err.error.message || err.statusText,  (err.error.statusMsg || err.name));
  }

}
