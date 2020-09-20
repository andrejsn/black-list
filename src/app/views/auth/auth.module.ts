import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFooterModule } from '@coreui/angular';

import { TranslateModule } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing.module';

import {
  SignupComponent,
  VerifyComponent,
  LoginComponent,
  LogoutComponent,
  ForgotComponent,
  ResetComponent,
  ErrorComponent,
} from '.';


@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    ForgotComponent,
    ResetComponent,
    ErrorComponent,
    VerifyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AuthRoutingModule,
    AppFooterModule,
  ],
})
export class AuthModule {}
