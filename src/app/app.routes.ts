import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './guards/auth-guard';
import { CategoriesComponent } from './pages/categories/categories';
import { LocationsComponent } from './pages/locations/locations';
import { AssetsComponent } from './pages/assets/assets';
import { UsersComponent } from './pages/users/users';
import { AdminGuard } from './guards/admin-guard';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard', // default when logged in
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'assets',
    component: AssetsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
