import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorsRoutingModule } from './debtors-routing.module';
import { DebtorsComponent } from './debtors.component';


@NgModule({
  declarations: [DebtorsComponent],
  imports: [
    CommonModule,
    DebtorsRoutingModule
  ]
})
export class DebtorsModule { }
