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
  profileForm: FormGroup;
  user: any = null;
  message = '';
  error = '';
  loading = true;
  saving = false;

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
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          location: user.location,
          skills: (user.skills || []).join(', '),
          bio: user.bio,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSave() {
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
      error: (err) => {
        const e = err.error;
        this.error = e?.errors?.length
          ? e.errors.map((x: any) => x.message).join(', ')
          : e?.message || 'Update failed';
        this.saving = false;
      },
    });
  }
}
