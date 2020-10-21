import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharingModule } from '@shared/shareModule';

import { DebtsComponent } from './debts.component';
import { DebtsRoutingModule } from './debts-routing.module';

@NgModule({
  declarations: [DebtsComponent],
  imports: [
    CommonModule,
    SharingModule,
    FormsModule,
    TranslateModule,
    PaginationModule,
    DebtsRoutingModule
  ]
})
export class DebtsModule { }
