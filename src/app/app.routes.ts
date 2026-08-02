import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login';
import { authGuard } from "./core/guards/auth-guard";
import { adminGuard } from "./core/guards/admin-guard";

export const routes: Routes = [
  // 1. App စဖွင့်ချင်း (Root) တွင် Login Page သို့ တိုက်ရိုက် Redirect လုပ်ရန်
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Login Page (Layout မပါတဲ့ သီးသန့် Page)
  {
    path: 'login',
    component: LoginComponent
  },

  // 3. Main Layout နဲ့ Page အားလုံး (canActivate ကို Parent အစား Children တစ်ခုချင်းစီ သို့မဟုတ် layout ပေါ်တွင် သေချာချိတ်ရန်)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Parent မှာထားတာက sub-path တွေနဲ့ ညှိတဲ့အခါ ပြဿနာတက်တတ်ပါသည်
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
        path: 'groups',
        loadComponent: () =>
            import('./pages/groups/groups.component').then((m) => m.GroupsComponent),
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
        canActivate: [adminGuard], // Admin Guard ထပ်စစ်သည်
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

  // 4. မရှိသော လမ်းကြောင်းများအတွက် Login သို့ ပို့ရန်
  { path: '**', redirectTo: 'login' },
];