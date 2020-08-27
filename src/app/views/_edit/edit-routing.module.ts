import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent, RepresentativeComponent } from '.';
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
    path: 'task',
    component: TaskComponent,
  },
  {
    path: 'representative',
    component: RepresentativeComponent,
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
