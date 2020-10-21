import { Injectable } from '@angular/core';
import {
  MenuItem,
  Debt,
  Debtor,
  Contract,
  Task,
  Invoice,
  Representative,
  Guarantor,
  Document, DocumentTableElement,
} from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  // cached objekts here:
  debt: Debt;
  debtor: Debtor;
  task: Task;
  contract: Contract;
  invoice: Invoice;
  representative: Representative;
  guarantor: Guarantor;
  document: Document;

  // breadCrumb
  menuItems: MenuItem[] = [{ route: '/', name: 'Home', active: true }];
  // document list
  documentsList: DocumentTableElement[] = [];

  private breadCrumb = new BehaviorSubject<MenuItem[]>(this.menuItems);
  private breadCrumb$ = this.breadCrumb.asObservable();

  private documentTable = new BehaviorSubject<DocumentTableElement[]>(this.documentsList);
  private documentTable$ = this.documentTable.asObservable();

  constructor() { }

  setBreadCrumb(breadCrumb: MenuItem[]) {
    this.breadCrumb.next(breadCrumb);
  }

  getBreadCrumb(): Observable<MenuItem[]> {
    return this.breadCrumb$;
  }

  setDocumentTable(documentTable: DocumentTableElement[]) {
    this.documentTable.next(documentTable);
  }

  getDocumentTable(): Observable<DocumentTableElement[]> {
    return this.documentTable$;
  }


}
