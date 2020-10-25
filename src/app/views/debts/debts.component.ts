import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { environment } from '@environments/environment';
import { Debt, DebtTypeOfFine } from '@app/models';
import { ObjectsService } from '@shared/services';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

interface DebtTableElement extends Debt {
  toDelete: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css']
})
export class DebtsComponent implements OnInit {
  rawDebtsList: DebtTableElement[];
  debtsList: DebtTableElement[] = [];
  pagedDebtsList: DebtTableElement[];

  loading: boolean;

  // sort name here
  sortDebtNameDirection: 'asc' | 'desc' | '';
  sortDebtDateDirection: 'asc' | 'desc' | '';
  sortDebtSumDirection: 'asc' | 'desc' | '';
  sortTypeOfFineDirection: 'asc' | 'desc' | '';

  // pagination,
  maxSize: number = 5;
  currentPage: number = 1;
  numPages: number = 0;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private snotifyService: SnotifyService,
  ) { }

  ngOnInit(): void {
    // TODO: page title
    // TODO: set breadcrumb menu

    // get data
    this.http
      .get<any>(`${environment.apiUrl}/get/debts`, {})
      .pipe(first())
      .subscribe(
        (data) => {
          this.rawDebtsList = data;
          this.debtsList = [...this.rawDebtsList];

          this.pagedDebtsList = this.rawDebtsList.slice(0, 10);
          // console.log(this.rawDebtorsList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
 * toggle table row
 */
  toggle(id: number) {
    this.debtsList.forEach((debt) => {
      debt.visible = debt.id === id ? !debt.visible : false;
    });
  }

  /**
 * go to add debtor
 */
  addDebt() {
    this.router.navigate(['/add/debt']);
  }

  sortDebtName(): void {

  }

  sortDebtDate(): void {

  }

  sortDebtSum(): void {

  }

  sortTypeOfFine(): void {

  }

  details(selectesDebt: Debt) {
    this.objectsService.debt = selectesDebt;
    this.router.navigate(['/debt']);
  }

  contracts(selectesDebt: Debt) {
    this.objectsService.debt = selectesDebt;
    this.router.navigate(['/debt/???']);
  }

  tasks(selectesDebt: Debt) {
    this.objectsService.debt = selectesDebt;
    this.router.navigate(['/debt/tasks']);
  }

  selectTypeOfFines(typeOfFine: DebtTypeOfFine) {
    this.debtsList = [
      ...this.rawDebtsList.filter((e) => e.typeOfFine === typeOfFine),
    ];

    this.cdRef.detectChanges(); // fixed: Expression has changed after it was checked on
    this.pageChanged({ page: 1, itemsPerPage: 10 });
  }

  /**
 * pagination -  page changed
 */
  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.pagedDebtsList = this.debtsList.slice(startItem, endItem);
  }

  /**
   * edit debt
   */
  editDebt(debtToEdit: DebtTableElement): void {
    this.objectsService.debt = debtToEdit;
    this.router.navigate(['/edit/debt']);
  }

  /**
   * delete debt
   */
  notifyDeleteDebt(debtorToDelete: DebtTableElement) {
    this.loading = true;
    debtorToDelete.toDelete = true;

    this.snotifyService
      .confirm('The debt will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteDebt(debtorToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () => this.cancelDeleteDebt(debtorToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteDebt(debtorToDelete);
      });
  }

  private cancelDeleteDebt(debtToDelete: DebtTableElement) {
    debtToDelete.toDelete = false;
  }

  private deleteDebt(debtToDelete: DebtTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/debt/destroy`, {
        id: debtToDelete.id,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.debtsList = reject(this.debtsList, function (
              debtor: DebtTableElement
            ) {
              return (debtor.id as number) === (response.deleted as number);
            });
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }
}
