import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DebtorCachedService } from '@app/shared/services';
import { Debtor } from '@app/models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  debtor: Debtor;

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

    this.debtor = this.debtorCachedService.debtor;
    //console.log(this.debtorCachedService.debtor.company);

  }

}
