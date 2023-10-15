import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { error } from 'jquery';
import { matchPassword } from '../../match-password.validator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLoading: boolean = false;
  statusMessage: string = '';
  failureMessage: string = '';
  constructor(private _AuthService: AuthService, private _Router: Router, private toastr: ToastrService) {
  }
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,10}$/)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,10}$/)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}/)]),
  }, { validators: matchPassword })

  register(registerForm: FormGroup): void {
    this.isLoading = true;
    if (registerForm.status == 'VALID') {
      this._AuthService.register(registerForm.value).subscribe({
        next: (response) => {
          this.statusMessage = '';
          this.failureMessage = '';
          this.isLoading = false;
          localStorage.setItem('userToken', response.token);
          this._AuthService.userData.next(response.token);
          this._Router.navigate(['/home']);
          this.toastr.success(`${response.message}`, `Registeration`);
        },
        error: (err) => {
          this.toastr.error(err.error.message || err.statusText, `Registeration  ` + (err.error.statusMsg || err.name));
          this.statusMessage = err.error.statusMsg;
          this.failureMessage = err.error.message;
          this.isLoading = false;
        }
      })
    } else {
      this.isLoading = false;
    }

  }
}

