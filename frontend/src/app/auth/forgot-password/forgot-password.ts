import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  requestForm: FormGroup;
  resetForm: FormGroup;
  error = '';
  success = '';
  loading = false;
  otpSent = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  requestOtp() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    this.email = this.requestForm.value.email;

    this.otpService.sendForgotPasswordOtp(this.email).subscribe({
      next: (res) => {
        this.otpSent = true;
        this.success = res.message || 'OTP sent to your email.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not send OTP.';
        this.loading = false;
      },
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.otpService.resetForgotPassword({
      email: this.email,
      ...this.resetForm.value,
    }).subscribe({
      next: (res) => {
        this.success = res.message || 'Password reset successfully. You can sign in now.';
        this.loading = false;
        this.resetForm.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not reset password.';
        this.loading = false;
      },
    });
  }
}
