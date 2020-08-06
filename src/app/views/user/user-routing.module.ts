import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';
import { PaymentsComponent } from './payments/payments.component';
import {CardComponent, PaypalComponent, TokenComponent} from './payment';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes =
[
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Logout'
    }
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    data: {
      title: 'Payments'
    }
  },
  {
    path: 'payment/card',
    component: CardComponent,
    data: {
      title: 'Payments'
    }
  },
  {
    path: 'payment/paypal',
    component: PaypalComponent,
    data: {
      title: 'Payments'
    }
  },
  {
    path: 'payment/token',
    component: TokenComponent,
    data: {
      title: 'Payments'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile'
    }
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    data: {
      title: 'Notifications'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
