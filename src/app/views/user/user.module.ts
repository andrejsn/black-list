import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { PaymentsComponent } from './payments/payments.component';


@NgModule({
  declarations: [LogoutComponent,PaymentsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
