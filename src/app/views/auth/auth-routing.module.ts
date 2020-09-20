import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  SignupComponent,
  VerifyComponent,
  LoginComponent,
  LogoutComponent,
  ForgotComponent,
  ResetComponent,
} from '.';
import { ErrorComponent } from './reset/error/error.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'verify/:token',
    component: VerifyComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
  {
    path: 'reset/:token',
    component: ResetComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
