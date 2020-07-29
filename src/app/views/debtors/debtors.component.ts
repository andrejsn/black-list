import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { Debtor, DebtorStatus } from '@app/models';
import { DebtorCachedService, CurrentlyTitleService } from '@shared/services';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

interface DebtorTableElement extends Debtor {
  visible: boolean;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css'],
})
export class DebtorsComponent implements OnInit {
  rawDebtorsList: DebtorTableElement[];
  debtorsList: DebtorTableElement[] = [];
  pagedDebtorsList: DebtorTableElement[];

  //  search
  search: string;

  // sort name
  sortCompanyNameDirection: 'asc' | 'desc' | '';
  sortRegisterDateDirection: 'asc' | 'desc' | '';
  sortDebtDirection: 'asc' | 'desc' | '';
  sortStatusDirection: 'asc' | 'desc' | '';

  // pagination
  maxSize: number = 5;
  currentPage: number = 1;
  numPages: number = 0;

  constructor(
    private currentlyTitleService: CurrentlyTitleService,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private debtorCachedService: DebtorCachedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // set title
    this.translate
      .get('app-sidebar-nav-link.debtors')
      .subscribe((res: string) => {
        this.currentlyTitleService.title = res;
      });
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
  toggle(rawDebtorsList: DebtorTableElement[], index: number) {
    for (let i = 0; i < rawDebtorsList.length; i++) {
      const debtor = rawDebtorsList[i];
      const selector = `.row-num-${i}`;

      if (i === index) {
        document.querySelector(selector).classList.toggle('d-none');
        debtor.visible = !debtor.visible;
      } else {
        document.querySelector(selector).classList.add('d-none');
        debtor.visible = false;
      }
    }
  }

  /**
   * go to contracts
   */
  contracts(selectesDebtor: Debtor) {
    this.debtorCachedService.debtor = selectesDebtor;
    this.router.navigate(['/debtor/contracts']);
  }

  /**
   * go to contracts
   */
  details(selectesDebtor: Debtor) {
    this.debtorCachedService.debtor = selectesDebtor;
    this.router.navigate(['/debtor/details']);
  }

  /**
   * go to tasks
   */
  tasks(selectesDebtor: Debtor) {
    this.debtorCachedService.debtor = selectesDebtor;
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

    this.cdr.detectChanges(); // fixed: Expression has changed after it was checked on
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

    this.cdr.detectChanges(); // fixed: Expression has changed after it was checked on
    // FIXME page:  Math.floor(this.debtorsList.length / 10 + 1),
    this.pageChanged({ page: 1, itemsPerPage: 10 });
  }
}
