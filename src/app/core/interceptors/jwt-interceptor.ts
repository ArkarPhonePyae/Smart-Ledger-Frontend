import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 🛑 ဤလိုင်းကို အသစ်ထည့်ပါ: Help API များနှင့် သက်ဆိုင်ပါက Token ထည့်စရာမလိုဘဲ ကျော်သွားမည်
  if (req.url.includes('/api/help')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};