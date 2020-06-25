import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DebtorCachedService } from '@app/shared/services';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    if(!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    console.log(this.debtorCachedService.debtor.company);

  }

}
