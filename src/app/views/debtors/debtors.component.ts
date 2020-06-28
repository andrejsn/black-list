import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { Debtor } from '@app/models';
import { DebtorCachedService, CurrentlyTitleService } from '@shared/services';


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
  count: number;

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
}
