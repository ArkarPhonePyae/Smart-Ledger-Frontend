import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // LocalStorage ထဲက Token ကို ယူမည်

  if (token) {
    // Request Header ထဲသို့ Authorization (Bearer Token) ထည့်မည်
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};