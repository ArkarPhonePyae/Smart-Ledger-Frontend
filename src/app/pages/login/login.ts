import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
      private authService: Auth,
      private themeService: ThemeService,
      private router: Router
  ) {}

  onLogin(): void {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (resData: any) => {
        console.log('Cleaned Login Data:', resData);

        if (resData && resData.accessToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');

          localStorage.setItem('token', resData.accessToken);

          if (resData.role) {
            localStorage.setItem('role', resData.role);
          }

          if (resData.darkMode !== undefined) {
            this.themeService.setDarkMode(resData.darkMode);
          }

          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Token not received. Please try again!';
        }
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = '\n' +'Unable to log in. Please check your email or password!';
        }
        console.error(err);
      }
    });
  }
}