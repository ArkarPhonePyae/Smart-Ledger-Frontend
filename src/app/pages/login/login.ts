import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme.service'; // 👈 ThemeService တည်နေရာအတိုင်း ချိန်ရန်

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
      private authService: Auth,
      private themeService: ThemeService, // 👈 Inject လုပ်ပါ
      private router: Router
  ) {}

  onLogin(): void {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (resData: any) => {
        console.log('Cleaned Login Data:', resData);

        if (resData && resData.accessToken) {
          // တန်ဖိုးအဟောင်းများကို အရင်ရှင်းမည်
          localStorage.removeItem('token');
          localStorage.removeItem('role');

          // 1. Token ကို သိမ်းမည်
          localStorage.setItem('token', resData.accessToken);

          // 2. Role ကို သိမ်းမည်
          if (resData.role) {
            localStorage.setItem('role', resData.role);
          }

          // 3. Dark Mode အခြေအနေကို ThemeService သို့ ပို့၍ UI တွင် Apply လုပ်မည်
          if (resData.darkMode !== undefined) {
            this.themeService.setDarkMode(resData.darkMode);
          }

          // 4. Dashboard သို့ အောင်မြင်စွာ ပို့မည်
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Token မရရှိပါ။ ကျေးဇူးပြု၍ ပြန်ကြိုးစားပါ။';
        }
      },
      error: (err) => {
        this.errorMessage = 'Login ဝင်မရပါ။ Email သို့မဟုတ် Password ကို စစ်ပါ။';
        console.error(err);
      }
    });
  }
}