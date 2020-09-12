import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { UserRoutingModule } from './user-routing.module';

import {
  PaymentsComponent,
  ProfileComponent,
  NotificationsComponent,
  CardComponent,
  PaypalComponent,
  TokenComponent,
  SettingComponent,
  MessagesComponent,
} from '.';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    TranslateModule,
  ],
  declarations: [
    PaymentsComponent,
    ProfileComponent,
    NotificationsComponent,
    CardComponent,
    PaypalComponent,
    TokenComponent,
    SettingComponent,
    MessagesComponent,
  ],
})
export class UserModule {}
