import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  tab: 'profile' | 'password' = 'profile';

  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any = null;
  loading = true;

  message = '';
  error = '';
  saving = false;

  sendingOtp = false;
  otpSent = false;
  otpMessage = '';
  otpError = '';

  pwMessage = '';
  pwError = '';
  changing = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private otp: OtpService,
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      location: [''],
      skills: [''],
      bio: [''],
    });
    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  ngOnInit() {
    const cached = this.auth.getUser();
    if (cached) {
      this.user = cached;
      this.patchForm(cached);
    }
    this.loading = false;

    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.patchForm(user);
      },
      error: () => {},
    });
  }

  private patchForm(user: any) {
    this.profileForm.patchValue({
      name: user?.name || '',
      email: user?.email || '',
      location: user?.location || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
      bio: user?.bio || '',
    });
  }

  saveProfile() {
    this.saving = true;
    this.message = '';
    this.error = '';

    const raw = this.profileForm.value;
    const data = {
      name: raw.name,
      location: raw.location,
      bio: raw.bio,
      skills: raw.skills
        ? raw.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    };

    this.auth.updateProfile(data).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.user = res;
        this.message = 'Profile updated successfully';
        this.saving = false;
      },
      error: (err: any) => {
        const e = err.error;
        this.error = e?.errors?.length
          ? e.errors.map((x: any) => x.message).join(', ')
          : e?.message || 'Update failed';
        this.saving = false;
      },
    });
  }

  requestOtp() {
    this.sendingOtp = true;
    this.otpMessage = '';
    this.otpError = '';

    this.otp.sendOtp().subscribe({
      next: (res: any) => {
        this.otpSent = true;
        this.otpMessage = res?.message || 'OTP sent to your email';
        this.sendingOtp = false;
      },
      error: (err: any) => {
        this.otpError = err?.error?.message || 'Failed to send OTP';
        this.sendingOtp = false;
      },
    });
  }

  savePassword() {
    this.pwMessage = '';
    this.pwError = '';
    const { otp, newPassword, confirmPassword } = this.passwordForm.value;

    if (this.passwordForm.invalid) {
      this.pwError = 'Please fill in all fields';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.pwError = 'New passwords do not match';
      return;
    }

    this.changing = true;
    this.otp.verifyAndChange({ otp, newPassword, confirmPassword }).subscribe({
      next: (res: any) => {
        this.pwMessage = res?.message || 'Password changed successfully';
        this.changing = false;
        this.otpSent = false;
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.pwError = err?.error?.message || 'Could not change password';
        this.changing = false;
      },
    });
  }

  resendOtp() {
    this.otpSent = false;
    this.otpMessage = '';
    this.otpError = '';
    this.pwMessage = '';
    this.pwError = '';
    this.passwordForm.reset();
  }
}
