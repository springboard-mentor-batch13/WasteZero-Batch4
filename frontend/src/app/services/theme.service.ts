import { Injectable } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: AppTheme = 'light';

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.currentTheme = savedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
  }

  get theme(): AppTheme {
    return this.currentTheme;
  }

  toggle(): AppTheme {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
    return this.currentTheme;
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.currentTheme;
  }
}
