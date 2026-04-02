import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',  loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'accounts',   loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent) },
  { path: 'failures',   loadComponent: () => import('./features/failures/failures.component').then(m => m.FailuresComponent) },
  { path: 'campaigns',  loadComponent: () => import('./features/campaigns/campaigns.component').then(m => m.CampaignsComponent) },
  { path: 'pricing',    loadComponent: () => import('./features/pricing/pricing.component').then(m => m.PricingComponent) },
  { path: 'comms',      loadComponent: () => import('./features/comms/comms.component').then(m => m.CommsComponent) },
  { path: 'queries',    loadComponent: () => import('./features/queries/queries.component').then(m => m.QueriesComponent) },
  { path: 'setup',      loadComponent: () => import('./features/setup/setup.component').then(m => m.SetupComponent) },
  { path: '**', redirectTo: 'dashboard' },
];
