import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorsRoutingModule } from './debtors-routing.module';
import { DebtorsComponent } from './debtors.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [DebtorsComponent],
  imports: [
    CommonModule,
    DebtorsRoutingModule,
    TranslateModule,
  ]
})
export class DebtorsModule { }
