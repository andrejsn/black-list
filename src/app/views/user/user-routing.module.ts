import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P404Component } from '../error/404.component';
import {
  NotificationsComponent,
  MessagesComponent,
  ProfileComponent,
  SettingComponent,
  PaymentsComponent,
  CardComponent,
  PaypalComponent,
  TokenComponent,
} from '.';


const routes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'setting',
    component: SettingComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'payment/card',
    component: CardComponent,
  },
  {
    path: 'payment/paypal',
    component: PaypalComponent,
  },
  {
    path: 'payment/token',
    component: TokenComponent,
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
