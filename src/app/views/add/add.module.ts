import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { DebtorComponent } from './debtor/debtor.component';


@NgModule({
  declarations: [DebtorComponent],
  imports: [
    CommonModule,
    AddRoutingModule,
  ]
})
export class AddModule { }