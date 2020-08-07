import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  LoginComponent,
  LogoutComponent,
  ForgotComponent,
  SignupComponent,
} from '.';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Logout',
    },
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Signup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
