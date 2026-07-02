import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly account = signal<User | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: [''],
    location: [''],
    bio: [''],
    skills: [''], // comma-separated in the UI
  });

  ngOnInit(): void {
    this.users.getProfile().subscribe({
      next: ({ user }) => {
        this.account.set(user);
        this.form.patchValue({
          name: user.name,
          location: user.location,
          bio: user.bio,
          skills: user.skills.join(', '),
        });
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const skills = raw.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    this.users
      .updateProfile({ name: raw.name, location: raw.location, bio: raw.bio, skills })
      .subscribe({
        next: ({ user }) => {
          this.account.set(user);
          this.saving.set(false);
          this.saved.set(true);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.saving.set(false);
        },
      });
  }
}
