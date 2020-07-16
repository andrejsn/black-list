import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { Debtor } from '@app/models';
import { DebtorCachedService, CurrentlyTitleService } from '@shared/services';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';


interface DebtorTableElement extends Debtor {
  visible: boolean;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent implements OnInit {

  debtorsList: DebtorTableElement[];
  pagedDebtorsList:DebtorTableElement[];
  count: number;

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
          this.debtorsList = data;
          this.count = this.debtorsList.length;
          this.pagedDebtorsList = this.debtorsList.slice(0,10);
          // console.log(this.debtorsList);

        },
        error => {
          console.log(error);

        }
      );
  }

  /**
   * toggle table row
   */
  toggle(debtorsList: DebtorTableElement[], index: number) {
    for (let i = 0; i < debtorsList.length; i++) {
      const debtor = debtorsList[i];
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
    console.log(event);
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedDebtorsList = this.debtorsList.slice(startItem, endItem);
  }
}
