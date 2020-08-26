import { Injectable } from '@angular/core';
import { Debtor, Task, MenuItem } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class CachedObjectsService {
  // cached objekts here:
  debtor: Debtor;
  task: Task;
  // bread crumb menu
  breadcrumbItems: MenuItem[];

  constructor() { }
}
