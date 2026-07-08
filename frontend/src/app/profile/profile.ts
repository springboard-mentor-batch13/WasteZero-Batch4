import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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

  pwMessage = '';
  pwError = '';
  pwSaving = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      location: [''],
      skills: [''],
      bio: [''],
    });
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
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

  savePassword() {
    this.pwMessage = '';
    this.pwError = '';
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (!currentPassword || !newPassword) {
      this.pwError = 'Please fill in all fields';
      return;
    }
    if (newPassword.length < 6) {
      this.pwError = 'New password must be at least 6 characters';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.pwError = 'New passwords do not match';
      return;
    }

    this.pwSaving = true;
    this.auth.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({
      next: () => {
        this.pwMessage = 'Password changed successfully';
        this.pwSaving = false;
        this.passwordForm.reset();
      },
      error: (err: any) => {
        const e = err.error;
        this.pwError = e?.errors?.length
          ? e.errors.map((x: any) => x.message).join(', ')
          : e?.message || 'Could not change password';
        this.pwSaving = false;
      },
    });
  }
}
