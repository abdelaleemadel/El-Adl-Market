import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const matchPassword:ValidatorFn=(control:AbstractControl):ValidationErrors|null =>
{
let password = control.get('password');
let rePassword = control.get('rePassword');
if(password?.value != rePassword?.value){
  return {
    matchPasswordError:true
  }
}
return null
}
