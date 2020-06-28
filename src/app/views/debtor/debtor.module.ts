import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DetailsComponent } from './details/details.component';
import { ContractsComponent, InvoicesComponent, RepresentativesComponent, GuarantorsComponent, DocumentsComponent } from '.';
import { TemplateComponent } from './templates/templates.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ShortenTextPipe } from '@shared/helpers';


@NgModule({
  declarations: [
    DetailsComponent,
    ContractsComponent,
    InvoicesComponent,
    RepresentativesComponent,
    GuarantorsComponent,
    DocumentsComponent,
    TemplateComponent,

    ShortenTextPipe,
  ],
  imports: [
    CommonModule,
    DebtorRoutingModule,
    CollapseModule,
  ]
})
export class DebtorModule { }
