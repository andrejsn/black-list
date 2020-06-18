import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { DebtorComponent } from './debtor/debtor.component';


@NgModule({
  declarations: [DebtorComponent],
  imports: [
    CommonModule,
    NgxEditorModule,
    AddRoutingModule,
  ]
})
export class AddModule { }
