import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnDestroy {
  currentStep: 1 | 2 = 1;

  fullName = '';
  email = '';
  password = '';
  phone = '';

  otpValue = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  showPassword = false;
  isPasswordTouched = false;

  timeLeft = 60;
  timerInterval?: ReturnType<typeof setInterval>;
  canResend = false;

  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  constructor(
      private authService: Auth,
      private themeService: ThemeService,
      private router: Router
  ) {}

  ngOnDestroy(): void {
    this.clearTimer();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  startTimer(): void {
    this.timeLeft = 60;
    this.canResend = false;
    this.clearTimer();

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.canResend = true;
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onPasswordChange(): void {
    if (!this.password || this.password.length === 0) {
      this.isPasswordTouched = false;
    } else {
      this.isPasswordTouched = true;
    }

    const pwd = this.password;
    this.hasMinLength = pwd.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(pwd);
    this.hasLowerCase = /[a-z]/.test(pwd);
    this.hasNumber = /[0-9]/.test(pwd);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/]/ .test(pwd);
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSpecialChar;
  }

  onRegister(): void {
    if (!this.isPasswordValid) {
      this.errorMessage = '\n' +
          'Please fill in the password completely in accordance with the password rules!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: 'ROLE_USER',
      proMember: false,
      darkMode: false
    };

    this.authService.register(userData as any).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.currentStep = 2;
        this.successMessage = '\n' +'OTP code has been sent to your email.';
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = '\n' + 'Unable to create account. Please check the information!';
        }
        console.error(err);
      }
    });
  }

  onResendOtp(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: 'ROLE_USER',
      proMember: false,
      darkMode: false
    };

    this.authService.register(userData as any).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'New OTP code has been sent.';
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unable to send OTP code again!';
        }
        console.error(err);
      }
    });
  }

  onVerifyOtp(): void {
    const fullOtp = this.otpValue ? this.otpValue.trim() : '';
    if (fullOtp.length < 6) {
      this.errorMessage = '\n' + 'Please enter the full 6-digit OTP code.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const verifyData = {
      email: this.email,
      otp: fullOtp
    };

    this.authService.verifyOtp(verifyData).subscribe({
      next: (resData: any) => {
        this.isLoading = false;
        this.clearTimer();

        if (resData && resData.accessToken) {
          localStorage.setItem('token', resData.accessToken);
          if (resData.role) {
            localStorage.setItem('role', resData.role);
          }
          if (resData.darkMode !== undefined) {
            this.themeService.setDarkMode(resData.darkMode);
          }
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'The OTP code is incorrect or has expired!';
        }
        console.error(err);
      }
    });
  }
}