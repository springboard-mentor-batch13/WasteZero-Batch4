import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  otpForm: FormGroup;
  error = '';
  otpError = '';
  otpNotice = '';
  devOtp = '';
  loading = false;
  sendingOtp = false;
  showPassword = false;
  theme: AppTheme = 'light';

  // Once the email OTP has been sent, the details form is locked and the
  // OTP field is shown. This is what actually stops sign-ups with fake or
  // temporary inboxes: the account is only created after the OTP sent to
  // that address is verified.
  otpSent = false;
  otpVerifiedEmail = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private otpService: OtpService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.theme = this.themeService.theme;
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
      confirmPassword: ['', Validators.required],
      role: ['volunteer'],
      location: [''],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  sendOtp() {
    this.error = '';
    if (this.emailControl?.invalid) {
      this.emailControl.markAsTouched();
      this.error = 'Enter a valid email address first';
      return;
    }
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error = 'Please fill in all required fields before verifying your email';
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.sendingOtp = true;
    const email = this.registerForm.value.email;

    this.otpService.sendRegisterOtp(email).subscribe({
      next: (res) => {
        this.otpSent = true;
        this.otpVerifiedEmail = email;
        this.otpNotice = res.message || `OTP sent to ${email}`;
        this.devOtp = res.otp || '';
        if (this.devOtp) {
          this.otpForm.patchValue({ otp: this.devOtp });
        }
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not send verification OTP';
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
    });
  }

  editDetails() {
    this.otpSent = false;
    this.otpError = '';
    this.otpNotice = '';
    this.devOtp = '';
    this.otpForm.reset();
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (!this.otpSent || this.otpVerifiedEmail !== this.registerForm.value.email) {
      this.error = 'Please verify your email with the OTP before creating an account';
      return;
    }
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.otpError = 'Enter the 6 digit OTP sent to your email';
      return;
    }

    this.loading = true;
    this.error = '';
    this.otpError = '';

    const { confirmPassword, ...data } = this.registerForm.value;
    const payload = { ...data, otp: this.otpForm.value.otp };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const e = err.error;
        this.error = e?.errors?.length
          ? e.errors.map((x: any) => x.message).join(', ')
          : e?.message || 'Registration failed';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
