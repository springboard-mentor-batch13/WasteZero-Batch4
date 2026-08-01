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
import { ApplicationsComponent } from './applications/applications';
import { MatchSuggestions } from './match-suggestions/match-suggestions';
import { Messages } from './messages/messages';
import { Notifications } from './notifications/notifications';
import { SchedulePickup } from './schedule-pickup/schedule-pickup';
import { Support } from './support/support';

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
      { path: 'match-suggestions', component: MatchSuggestions },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'profile', component: Profile },
      { path: 'messages', component: Messages },
      { path: 'notifications', component: Notifications },
      { path: 'schedule-pickup', component: SchedulePickup },
      { path: 'support', component: Support },

  { path: 'opportunities', component: OpportunityList },
  { path: 'opportunities/create', component: CreateOpportunity },
  { path: 'opportunities/edit/:id', component: EditOpportunity },
  { path: 'opportunities/:id', component: OpportunityDetail },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
],
  },
  { path: '**', redirectTo: 'dashboard' },
];