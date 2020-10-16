import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers+
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { AuthComponent } from './views/auth/auth.component';
import { AuthenticationGuardService } from './shared/helpers/authentication/authentication.guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500',
    },
  },
  // authentication & authorization: login, signup ...
  {
    path: 'auth',
    loadChildren: () =>
      import('./views/auth/auth.module').then((m) => m.AuthModule),
  },

  // ### DEFAULT VIEW ###
  {
    path: '',
    component: DefaultLayoutComponent,

    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'add',
        loadChildren: () =>
          import('./views/_add/add.module').then((m) => m.AddModule),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('./views/_edit/edit.module').then((m) => m.EditModule),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'debtors',
        loadChildren: () =>
          import('./views/debtors/debtors.module').then((m) => m.DebtorsModule),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'debtor',
        loadChildren: () =>
          import('./views/debtor/debtor.module').then((m) => m.DebtorModule),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./views/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
        canActivate: [AuthenticationGuardService],
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./views/help/help.module').then(
            (m) => m.HelpModule
          ),
        canActivate: [AuthenticationGuardService],
      },
      // user: profile, payments, lock account, logout
      {
        path: 'user',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => m.UserModule),
        canActivate: [AuthenticationGuardService],
      },
    ],
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
