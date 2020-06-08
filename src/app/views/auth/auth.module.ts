import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { LoginComponent } from './login/login.component';




@NgModule({
  declarations:
  [
    LoginComponent,
    SignupComponent,

    LogoutComponent,
    SignupComponent,
    ForgotComponent,
    ResetComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
