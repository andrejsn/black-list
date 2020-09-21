import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebtorsComponent } from './debtors.component';


const routes: Routes = [
  {
    path: '',
    component: DebtorsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorsRoutingModule { }
