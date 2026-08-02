import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('role'); // Login ဝင်စဉ်က သိမ်းထားသော Role

  // ROLE_ADMIN သို့မဟုတ် ADMIN ဖြစ်ပါက ဝင်ခွင့်ပြုမည်
  if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
    return true;
  } else {
    // Admin မဟုတ်လျှင် Dashboard သို့ ပို့မည်
    router.navigate(['/dashboard']);
    return false;
  }
};