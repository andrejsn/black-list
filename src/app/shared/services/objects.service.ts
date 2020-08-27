import { Injectable } from '@angular/core';
import { Debtor, Task, MenuItem } from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {
  // cached objekts here:
  debtor: Debtor;
  task: Task;

  // title
  private title = new BehaviorSubject<String>('App title');
  private title$ = this.title.asObservable();

  // bread crumb menu
  breadcrumbItems: MenuItem[];

constructor() { }


setTitle(title: String) {
  this.title.next(title);
}

getTitle(): Observable<String> {
  return this.title$;
}
}
