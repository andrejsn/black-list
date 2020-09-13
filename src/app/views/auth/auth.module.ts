import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFooterModule } from '@coreui/angular';

import { TranslateModule } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing.module';

import {
  LoginComponent,
  LogoutComponent,
  SignupComponent,
  ForgotComponent,
  ResetComponent,
} from '.';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    ForgotComponent,
    ResetComponent,
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
