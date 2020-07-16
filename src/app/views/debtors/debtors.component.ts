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
  pagedDebtorsList: DebtorTableElement[];
  count: number;

  // sort name
  sortCompanyNameDirection: 'asc' | 'desc';

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
          this.pagedDebtorsList = this.debtorsList.slice(0, 10);
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


  /**
   * sort company name
   * @param n
   */
  sortCompanyName() {


    if (this.sortCompanyNameDirection === 'asc') {
      this.sortCompanyNameDirection = "desc";
      this.debtorsList.sort((a, b) => { return (b.company.localeCompare(a.company)) });
    } else {
      this.sortCompanyNameDirection = "asc";
      this.debtorsList.sort((a, b) => { return (a.company.localeCompare(b.company)) });
    }

    this.pageChanged({page: this.currentPage, itemsPerPage: 10});




  }

  /**
   * sort table https://www.w3schools.com/howto/howto_js_sort_table.asp
   */
  sortTable(n: number) {
    console.log(n);

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("debtors");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;


      // console.log(rows);
      for (i = 1; i < (rows.length - 1); i++) {
        x = rows[i].getElementsByTagName("td") as HTMLCollection;

        if (x.length === 0) continue;

        console.log(x);

      }


      // /* Loop through all table rows (except the
      // first, which contains table headers): */
      // for (i = 1; i < (rows.length - 1); i++) {
      //   // Start by saying there should be no switching:
      //   shouldSwitch = false;
      //   /* Get the two elements you want to compare,
      //   one from current row and one from the next: */
      //   x = rows[i].getElementsByTagName("td")[n];
      //   y = rows[i + 1].getElementsByTagName("td")[n];
      //   /* Check if the two rows should switch place,
      //   based on the direction, asc or desc: */
      //   if (dir == "asc") {
      //     if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
      //       // If so, mark as a switch and break the loop:
      //       shouldSwitch = true;
      //       break;
      //     }
      //   } else if (dir == "desc") {
      //     if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
      //       // If so, mark as a switch and break the loop:
      //       shouldSwitch = true;
      //       break;
      //     }
      //   }
      // }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
}
