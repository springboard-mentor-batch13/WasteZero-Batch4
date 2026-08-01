import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  loading = false;
  showPassword = false;
  theme: AppTheme = 'light';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.theme = this.themeService.theme;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
