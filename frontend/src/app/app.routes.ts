import { Routes } from '@angular/router';
// Import karte waqt dhyaan rakho, agar folder structure alag hai toh path sahi daalo
import { LoginComponent } from './auth/login/login'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];