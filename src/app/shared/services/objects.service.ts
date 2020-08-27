import { Injectable } from '@angular/core';
import { Debtor, Task, MenuItem } from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  // cached objekts here:
  debtor: Debtor;
  task: Task;

  menuItems: MenuItem[] = [{ route: '/', name: 'Home', active: true }];

  // bread crumb title
  private title = new BehaviorSubject<MenuItem[]>(this.menuItems);
  private title$ = this.title.asObservable();

  constructor() {}

  setTitle(title: MenuItem[]) {
    this.title.next(title);
  }

  getTitle(): Observable<MenuItem[]> {
    return this.title$;
  }
}
