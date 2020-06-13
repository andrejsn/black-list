import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  // {
  //   path: ''
  // },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Signup'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
