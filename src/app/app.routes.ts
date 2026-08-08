import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register/register';
import { authGuard } from "./core/guards/auth-guard";
import { adminGuard } from "./core/guards/admin-guard";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'expenses',
        loadComponent: () =>
            import('./pages/expenses/expenses.component').then((m) => m.ExpensesComponent),
      },
      {
        path: 'expenses/new',
        loadComponent: () =>
            import('./pages/expenses/expenses.component').then((m) => m.ExpensesComponent),
      },
      {
        path: 'expenses/edit/:id',
        loadComponent: () =>
            import('./pages/expenses/expenses.component').then((m) => m.ExpensesComponent),
      },
      {
        path: 'groups',
        loadComponent: () =>
            import('./pages/groups/groups.component').then((m) => m.GroupsComponent),
      },
      {
        path: 'groups/:id',
        loadComponent: () =>
            import('./features/groups/group-detail/group-detail').then((m) => m.GroupDetailComponent),
      },
      {
        path: 'friends',
        loadComponent: () =>
            import('./pages/friends/friends.component').then((m) => m.FriendsComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
            import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./pages/admin/admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
            import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
            import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
            import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
            import('./pages/notifications/notifications.component').then(
                (m) => m.NotificationsComponent
            ),
      },
      {
        path: 'help',
        loadComponent: () =>
            import('./pages/help/help.component').then((m) => m.HelpComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];