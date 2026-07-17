import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { Shell } from './layout/shell';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { authGuard } from './guards/auth.guard';
import { OpportunityList } from './opportunities/opportunity-list/opportunity-list';
import { CreateOpportunity } from './opportunities/create-opportunity/create-opportunity';
import { EditOpportunity } from './opportunities/edit-opportunity/edit-opportunity';
import { OpportunityDetail } from './opportunities/opportunity-detail/opportunity-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: Profile },

      //Opportunity routes
      { path: 'opportunities', component: OpportunityList },
      { path: 'opportunities/create', component: CreateOpportunity },
      { path: 'opportunities/edit/:id', component: EditOpportunity },
      { path: 'opportunities/:id', component: OpportunityDetail },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
