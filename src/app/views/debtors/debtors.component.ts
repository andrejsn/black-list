import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { environment } from '@environments/environment';
import { Debtor, DebtorStatus } from '@app/models';
import { ObjectsService } from '@shared/services';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

interface DebtorTableElement extends Debtor {
  toDelete: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.scss'],
})
export class DebtorsComponent implements OnInit {
  rawDebtorsList: DebtorTableElement[];
  debtorsList: DebtorTableElement[] = [];
  pagedDebtorsList: DebtorTableElement[];

  loading: boolean;

  //  search
  search: string;

  // sort name
  sortCompanyNameDirection: 'asc' | 'desc' | '';
  sortRegisterDateDirection: 'asc' | 'desc' | '';
  sortDebtDirection: 'asc' | 'desc' | '';
  sortStatusDirection: 'asc' | 'desc' | '';

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
  ) {}

  ngOnInit(): void {
    this.objectsService.debtor = null;
    this.objectsService.contract = null;
    this.objectsService.task = null;

    // set browser title
    this.title.setTitle('Debtors list');
    // set breadcrumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: true },
    ]);

    // get data
    this.http
      .get<any>(`${environment.apiUrl}/get/debtors`, {})
      .pipe(first())
      .subscribe(
        (data) => {
          this.rawDebtorsList = data;
          this.debtorsList = [...this.rawDebtorsList];

          this.pagedDebtorsList = this.rawDebtorsList.slice(0, 10);
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
    this.debtorsList.forEach((debtor) => {
      debtor.visible = debtor.id === id ? !debtor.visible : false;
    });
  }

  /**
   * go to contracts
   */
  contracts(selectesDebtor: Debtor) {
    this.objectsService.debtor = selectesDebtor;
    this.router.navigate(['/debtor/contracts']);
  }

  /**
   * go to debtor
   */
  details(selectesDebtor: Debtor) {
    this.objectsService.debtor = selectesDebtor;
    this.router.navigate(['/debtor']);
  }

  /**
   * go to tasks
   */
  tasks(selectesDebtor: Debtor) {
    this.objectsService.debtor = selectesDebtor;
    this.router.navigate(['/debtor/tasks']);
  }

  /**
   * go to add debtor
   */
  addDebtor() {
    this.router.navigate(['/add/debtor']);
  }

  /**
   * pagination -  page changed
   */
  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.pagedDebtorsList = this.debtorsList.slice(startItem, endItem);
  }

  /**
   * sort company name
   */
  sortCompanyName() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortCompanyNameDirection === 'asc') {
      this.sortCompanyNameDirection = 'desc';
      this.debtorsList.sort((a, b) => {
        return b.company.localeCompare(a.company);
      });
    } else {
      this.sortCompanyNameDirection = 'asc';
      this.debtorsList.sort((a, b) => {
        return a.company.localeCompare(b.company);
      });
    }

    this.sortRegisterDateDirection = '';
    this.sortDebtDirection = '';
    this.sortStatusDirection = '';

    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort register date
   */
  sortRegisterDate() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortRegisterDateDirection === 'asc') {
      this.sortRegisterDateDirection = 'desc';
      this.debtorsList.sort((a, b) => {
        return a.created_at.valueOf() < b.created_at.valueOf() ? 1 : -1;
      });
    } else {
      this.debtorsList.sort((a, b) => {
        return a.created_at.valueOf() > b.created_at.valueOf() ? 1 : -1;
      });
      this.sortRegisterDateDirection = 'asc';
    }

    this.sortCompanyNameDirection = '';
    this.sortDebtDirection = '';
    this.sortStatusDirection = '';

    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort debt
   */
  sortDebt() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortDebtDirection === 'asc') {
      this.sortDebtDirection = 'desc';
      this.debtorsList.sort((a, b) => {
        return a.debt < b.debt ? 1 : -1;
      });
    } else {
      this.debtorsList.sort((a, b) => {
        return a.debt > b.debt ? 1 : -1;
      });
      this.sortDebtDirection = 'asc';
    }

    this.sortCompanyNameDirection = '';
    this.sortRegisterDateDirection = '';
    this.sortStatusDirection = '';

    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort status
   */
  sortStatus() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortStatusDirection === 'asc') {
      this.sortStatusDirection = 'desc';
      this.debtorsList.sort((a, b) => {
        return this.statusToNumber(a.status) < this.statusToNumber(b.status)
          ? 1
          : -1;
      });
    } else {
      this.debtorsList.sort((a, b) => {
        return this.statusToNumber(a.status) > this.statusToNumber(b.status)
          ? 1
          : -1;
      });
      this.sortStatusDirection = 'asc';
    }

    this.sortCompanyNameDirection = '';
    this.sortRegisterDateDirection = '';
    this.sortDebtDirection = '';

    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * status get number for sorting
   */
  private statusToNumber(status): number {
    switch (status) {
      case 'awaiting':
        return 0;
      case 'in_work':
        return 1;
      case 'debt_collected':
        return 2;
      case 'to_sue':
        return 3;
      case 'in_court':
        return 4;
      case 'hopeless':
        return 5;
      case 'insolvency':
        return 6;
      default:
        break;
    }
  }

  /**
   * select statuses
   */
  selectStatuses(status: DebtorStatus) {
    this.debtorsList = [
      ...this.rawDebtorsList.filter((e) => e.status === status),
    ];

    this.cdRef.detectChanges(); // fixed: Expression has changed after it was checked on
    this.pageChanged({ page: 1, itemsPerPage: 10 });
  }

  /**
   * search debtor by name or register number
   */
  onSearchChange(searchValue: string): void {
    this.debtorsList = [
      ...this.rawDebtorsList.filter(
        (v) =>
          v.company.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
          v.reg_number.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      ),
    ];

    this.cdRef.detectChanges(); // fixed: Expression has changed after it was checked on
    // FIXME page:  Math.floor(this.debtorsList.length / 10 + 1),
    this.pageChanged({ page: 1, itemsPerPage: 10 });
  }

  /**
   * delete debtor
   * @param guarantorToDelete - debtor
   */
  notifyDeleteDebtor(debtorToDelete: DebtorTableElement) {
    this.loading = true;
    debtorToDelete.toDelete = true;

    this.snotifyService
      .confirm('The debtor will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteDebtor(debtorToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () => this.cancelDeleteDebtor(debtorToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteDebtor(debtorToDelete);
      });
  }

  private cancelDeleteDebtor(debtorToDelete: DebtorTableElement) {
    debtorToDelete.toDelete = false;
  }

  private deleteDebtor(debtorToDelete: DebtorTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/debtor/destroy`, {
        id: debtorToDelete.id,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.debtorsList = reject(this.debtorsList, function (
              debtor: DebtorTableElement
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
