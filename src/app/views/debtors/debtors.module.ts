import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DebtorsRoutingModule } from './debtors-routing.module';
import { DebtorsComponent } from './debtors.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DebtorFilterPipe, MomentjsPipe } from '@shared/helpers';


@NgModule({
  declarations: [DebtorsComponent , DebtorFilterPipe, MomentjsPipe],
  imports: [
    CommonModule,
    DebtorsRoutingModule,
    FormsModule,
    TranslateModule,
    PaginationModule,
  ]
})
export class DebtorsModule { }
