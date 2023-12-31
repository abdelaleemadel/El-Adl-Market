import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;
  statusMessage: string = '';
  failureMessage: string = '';
  constructor(private _Router: Router, private _AuthService: AuthService,
    private toastr: ToastrService) { }
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,10}$/)]),
  })
  navigateRegister(): void {
    this._Router.navigate(['register'])
    console.log(this._Router.navigate(['register'])
    );
  }

  login(loginForm: FormGroup): void {
    this.isLoading = true;
    if (loginForm.status == 'VALID') {
      this._AuthService.login(loginForm.value).subscribe({
        next: (response) => {
          this.statusMessage = '';
          this.failureMessage = '';
          this.isLoading = false;
          localStorage.setItem('userToken', response.token);
          this._AuthService.userData.next(response.token);
          this._Router.navigate(['/home']);
          this.toastr.success(`${response.message}`, `Login`);

        },
        error: (err) => {
          this.toastr.error(err.error.message || err.statusText, `Login  ` + (err.error.statusMsg || err.name));
          this.statusMessage = err.error.statusMsg;
          this.failureMessage = err.error.message;
          this.isLoading = false;
        },
      })
    } else {
      this.isLoading = false;

    }

  }

}
