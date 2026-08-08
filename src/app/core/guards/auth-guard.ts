import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('AuthGuard - Current Token:', token);

  if (token && token !== 'undefined' && token !== 'null') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};