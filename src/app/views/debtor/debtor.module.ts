import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DebtorComponent } from './debtor.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [DebtorComponent],
  imports: [
    CommonModule,
    DebtorRoutingModule,
    TranslateModule,
  ]
})
export class DebtorModule { }
