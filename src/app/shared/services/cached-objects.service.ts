import { Injectable } from '@angular/core';
import { Debtor, Task } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class CachedObjectsService {
  // cached objekts here:
  debtor: Debtor;
  task: Task;

  constructor() { }
}
