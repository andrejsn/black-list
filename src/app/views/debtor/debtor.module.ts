import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DetailsComponent } from './details/details.component';
import { ContractsComponent, InvoicesComponent, RepresentativesComponent, GuarantorsComponent, DocumentsComponent } from '.';
import { TemplateComponent } from './template/template.component';



@NgModule({
  declarations: [DetailsComponent, ContractsComponent, InvoicesComponent, RepresentativesComponent, GuarantorsComponent, DocumentsComponent, TemplateComponent],
  imports: [
    CommonModule,
    DebtorRoutingModule
  ]
})
export class DebtorModule { }
