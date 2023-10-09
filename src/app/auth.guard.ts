import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService: AuthService = inject(AuthService);
  let loggedUser: boolean = false;
  _AuthService.userData.subscribe((response) => {
    if (response) {
      loggedUser = true;
    } else { loggedUser = false }
  })

  if (loggedUser) {
    return true;
  }
  else {
    _Router.navigate(['/login'])
    return false;
  }
};
