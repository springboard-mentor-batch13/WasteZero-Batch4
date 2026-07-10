import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  activeTab: 'profile' | 'password' = 'profile';
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any = null;
  loading = true;
  saving = false;
  profileMessage = '';
  profileError = '';
  sendingOtp = false;
  otpSent = false;
  otpMessage = '';
  otpError = '';
  passwordForm: FormGroup;
  changingPassword = false;
  passwordMessage = '';
  passwordError = '';

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
    private otpService: OtpService,
    private cdr: ChangeDetectorRef,   
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      location: [''],
      skills: [''],
      bio: [''],
    });

    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    const cached = this.auth.getUser();
    if (cached) {
      this.user = cached;
      this.profileForm.patchValue({
        name: cached.name,
        email: cached.email,
        location: cached.location || '',
        skills: (cached.skills || []).join(', '),
        bio: cached.bio || '',
      });
      this.loading = false;
    }
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
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          location: user.location || '',
          skills: (user.skills || []).join(', '),
          bio: user.bio || '',
        });
        this.loading = false;
        this.cdr.detectChanges();   
      },
      error: () => {
        if (!this.user) {
          this.profileError = 'Failed to load profile. Please refresh.';
        }
        this.loading = false;
        this.cdr.detectChanges();   
      },
      error: () => {},
    });
  }

  setTab(tab: 'profile' | 'password') {
    this.activeTab = tab;
    this.profileMessage = '';
    this.profileError = '';
    this.otpSent = false;
    this.otpMessage = '';
    this.otpError = '';
    this.passwordMessage = '';
    this.passwordError = '';
    this.passwordForm.reset();
    this.cdr.detectChanges();   
  }

  onSave() {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.profileMessage = '';
    this.profileError = '';

    const { email, ...rest } = this.profileForm.value;
    const data = { ...rest };
    data.skills = data.skills
      ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    this.auth.updateProfile(data).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.user = res;
        this.profileMessage = 'Profile updated successfully!';
        this.saving = false;
        this.cdr.detectChanges();   
      },
      error: (err) => {
        this.profileError = err.error?.message || 'Update failed.';
        this.saving = false;
        this.cdr.detectChanges();   
      },
    });
  }

  requestOtp() {
    this.sendingOtp = true;
    this.otpMessage = '';
    this.otpError = '';
    this.cdr.detectChanges();

    this.otpService.sendOtp().subscribe({
      next: (res: any) => {
        this.otpSent = true;                          
        this.otpMessage = res?.message || 'OTP sent!';
        this.sendingOtp = false;
        this.cdr.detectChanges();   
      },
      error: (err: any) => {
        this.otpError = err?.error?.message || 'Failed to send OTP.';
        this.sendingOtp = false;
        this.cdr.detectChanges();   
      },
    });
  }

onChangePassword() {
  if (this.passwordForm.invalid) return;
  const { otp, currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

  if (newPassword !== confirmPassword) {
    this.passwordError = 'Passwords do not match';
    this.cdr.detectChanges();
    return;
  }

  this.changingPassword = true;
  this.passwordMessage = '';
  this.passwordError = '';

  this.otpService.verifyAndChange({ otp, currentPassword, newPassword, confirmPassword }).subscribe({
    next: (res) => {
      this.passwordMessage = res.message;
      this.changingPassword = false;
      this.otpSent = false;
      this.passwordForm.reset();
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.passwordError = err.error?.message || 'Failed to change password.';
      this.changingPassword = false;
      this.cdr.detectChanges();
    },
  });
}

  resendOtp() {
    this.otpSent = false;
    this.passwordForm.reset();
    this.passwordError = '';
    this.passwordMessage = '';
    this.cdr.detectChanges();   
  }
}