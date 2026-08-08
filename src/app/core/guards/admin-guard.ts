import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('role');

  if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};