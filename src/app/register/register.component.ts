import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { AuthserviceService } from '../authservice.service';
import { error } from 'jquery';
import { matchPassword } from '../match-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLoading:boolean = false;
constructor(private _AuthserviceService:AuthserviceService){
}
registerForm:FormGroup = new FormGroup({
name : new FormControl(null,[Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
email : new FormControl(null,[Validators.required, Validators.email]),
password : new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z].{5,10}$/)]),
rePassword : new FormControl(null,[Validators.required]),
phone : new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z].{5,10}$/)]),
}, {validators:matchPassword})

register(registerForm:FormGroup):void{
  this.isLoading = true
 this._AuthserviceService.register(registerForm.value).subscribe({
  next:(response) => console.log(response),
  error: (err) => console.log(err)
  })
  this.isLoading = false;

  }



}

/* "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDk3ZTk3NDVlZDRiMjQ4YzBlZTUwNCIsIm5hbWUiOiJhaG1lZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1MTIxMDQ4LCJleHAiOjE3MDI4OTcwNDh9.Cqrxcj9oGbNWCTh7asHbHi1XaRccu6jddxmTxr5A8E4" */
