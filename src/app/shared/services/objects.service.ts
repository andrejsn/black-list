import { Injectable } from '@angular/core';
import {
  Debtor,
  Task,
  Representative,
  MenuItem,
  Contract,
  Guarantor,
} from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  // cached objekts here:
  debtor: Debtor;
  task: Task;
  contract: Contract;
  representative: Representative;
  guarantor: Guarantor;

  // breadCrumb
  menuItems: MenuItem[] = [{ route: '/', name: 'Home', active: true }];

  private breadCrumb = new BehaviorSubject<MenuItem[]>(this.menuItems);
  private breadCrumb$ = this.breadCrumb.asObservable();

  constructor() {}

  setBreadCrumb(breadCrumb: MenuItem[]) {
    this.breadCrumb.next(breadCrumb);
  }

  getBreadCrumb(): Observable<MenuItem[]> {
    return this.breadCrumb$;
  }
}
