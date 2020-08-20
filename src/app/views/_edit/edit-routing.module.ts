import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent } from '.';
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
    data: {
      title: 'Add Task',
    },
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
