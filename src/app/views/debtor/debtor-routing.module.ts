import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractsComponent, DetailsComponent, TasksComponent } from '.';



const routes: Routes = [
  {
    path: 'contracts',
    component: ContractsComponent,
    data: {
      title: 'ContractsComponent'
    }
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: {
      title: 'ContractsComponent'
    }
  },
  {
    path: 'tasks',
    component: TasksComponent,
    data: {
      title: 'ContractsComponent'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorRoutingModule { }
