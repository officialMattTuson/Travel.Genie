import { Routes } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/authenticate/authenticate.component').then(
        (m) => m.AuthenticateComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    // canActivate: [AuthenticationGuard],
  },
  {
    path: 'create-trip',
    loadComponent: () =>
      import('./pages/create-trip/create-trip').then(
        (m) => m.CreateTrip
      ),
    // canActivate: [AuthenticationGuard],
  },
  {
    path: 'trips/plan/preview',
    loadComponent: () =>
      import('./pages/trip-plan-review/trip-plan-review.component').then(
        (m) => m.TripPlanReviewComponent
      ),
    // canActivate: [AuthenticationGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
