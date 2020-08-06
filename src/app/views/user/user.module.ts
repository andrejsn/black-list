import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { UserRoutingModule } from './user-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CardComponent } from './payment/card/card.component';
import { PaypalComponent } from './payment/paypal/paypal.component';
import { TokenComponent } from './payment/token/token.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    TranslateModule,
  ],
  declarations: [
    LogoutComponent,
    PaymentsComponent,
    ProfileComponent,
    NotificationsComponent,
    CardComponent,
    PaypalComponent,
    TokenComponent,
  ],
})
export class UserModule {}
