import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { Debtor, DebtorStatus } from '@app/models';
import { DebtorCachedService, CurrentlyTitleService } from '@shared/services';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DetailsComponent } from '../debtor/details/details.component';


interface DebtorTableElement extends Debtor {
  visible: boolean;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent implements OnInit {

  rawDebtorsList: DebtorTableElement[];
  debtorsList: DebtorTableElement[] = [];
  pagedDebtorsList: DebtorTableElement[];


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
    private debtorCachedService: DebtorCachedService
  ) { }

  ngOnInit(): void {
    // set title
    this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.currentlyTitleService.title = res; });
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/debtors`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.rawDebtorsList = data;
          this.debtorsList = [...this.rawDebtorsList];

          this.pagedDebtorsList = this.rawDebtorsList.slice(0, 10);
          // console.log(this.rawDebtorsList);

        },
        error => {
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
      let selector = `.row-num-${i}`;

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
      this.sortCompanyNameDirection = "desc";
      this.rawDebtorsList.sort((a, b) => { return (b.company.localeCompare(a.company)) });
    } else {
      this.sortCompanyNameDirection = "asc";
      this.rawDebtorsList.sort((a, b) => { return (a.company.localeCompare(b.company)) });
    }

    this.sortRegisterDateDirection = "";
    this.sortDebtDirection = "";
    this.sortStatusDirection = "";
    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort register date
   */
  sortRegisterDate() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortRegisterDateDirection === 'asc') {
      this.sortRegisterDateDirection = "desc";
      this.rawDebtorsList.sort((a, b) => { return (a.created_at.valueOf() < b.created_at.valueOf()) ? 1 : -1 });
    } else {
      this.rawDebtorsList.sort((a, b) => { return (a.created_at.valueOf() > b.created_at.valueOf()) ? 1 : -1 });
      this.sortRegisterDateDirection = "asc";
    }

    this.sortCompanyNameDirection = "";
    this.sortDebtDirection = "";
    this.sortStatusDirection = "";
    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort debt
   */
  sortDebt() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortDebtDirection === 'asc') {
      this.sortDebtDirection = "desc";
      this.rawDebtorsList.sort((a, b) => { return (a.debt < b.debt) ? 1 : -1 });
    } else {
      this.rawDebtorsList.sort((a, b) => { return (a.debt > b.debt) ? 1 : -1 });
      this.sortDebtDirection = "asc";
    }

    this.sortCompanyNameDirection = "";
    this.sortRegisterDateDirection = "";
    this.sortStatusDirection = "";
    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
   * sort status
   */
  sortStatus() {
    this.debtorsList = [...this.rawDebtorsList];

    if (this.sortStatusDirection === 'asc') {
      this.sortStatusDirection = "desc";
      this.rawDebtorsList.sort((a, b) => { return (a.status < b.status) ? 1 : -1 });
    } else {
      this.rawDebtorsList.sort((a, b) => { return (a.status > b.status) ? 1 : -1 });
      this.sortStatusDirection = "asc";
    }

    this.sortCompanyNameDirection = "";
    this.sortRegisterDateDirection = "";
    this.sortDebtDirection = "";
    this.pageChanged({ page: this.currentPage, itemsPerPage: 10 });
  }

  /**
  * select statuses
  */
  selectStatuses(status: DebtorStatus) {
    this.debtorsList = [...this.rawDebtorsList.filter(e => e.status === status)];

    this.pageChanged({ page: 1, itemsPerPage: 10 });
  }
}
