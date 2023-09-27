import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
const _Router = inject(Router);
   if(localStorage.getItem('userToken') !== null){

console.log(' Pass');

    return true;
  } else {
console.log('dont Pass');
_Router.navigate(['/login'])
    return false;
  }
};
