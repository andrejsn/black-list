import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DebtorComponent } from './debtor.component';
import { TranslateModule } from '@ngx-translate/core';
import { ContractsComponent } from './details/contracts/contracts.component';
import { InvoicesComponent } from './details/invoices/invoices.component';
import { RepresentativesComponent } from './details/representatives/representatives.component';
import { GuarantorsComponent } from './details/guarantors/guarantors.component';
import { DocumentsComponent } from './details/documents/documents.component';


@NgModule({
  declarations: [DebtorComponent, ContractsComponent, InvoicesComponent, RepresentativesComponent, GuarantorsComponent, DocumentsComponent],
  imports: [
    CommonModule,
    DebtorRoutingModule,
    TranslateModule,
  ]
})
export class DebtorModule { }
