import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ContractComponent,
  DebtComponent,
  DocumentComponent,
  GuarantorComponent,
  InvoiceComponent,
  RepresentativeComponent,
  TaskComponent,
} from '.';
import { P404Component } from '../error/404.component';

const routes: Routes = [
  // {
  //   path: 'debtor',
  //   component: DebtorComponent,
  //   data: {
  //     title: 'Add Debtor',
  //   },
  // },
  {
    path: 'debt',
    component: DebtComponent,
  },
  {
    path: 'task',
    component: TaskComponent,
  },
  {
    path: 'contract',
    component: ContractComponent,
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
  },
  {
    path: 'representative',
    component: RepresentativeComponent,
  },
  {
    path: 'guarantor',
    component: GuarantorComponent,
  },
  {
    path: 'document',
    component: DocumentComponent,
  },


  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
