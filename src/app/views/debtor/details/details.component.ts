import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CachedObjectsService } from '@app/shared/services';
import { Debtor } from '@app/models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  debtor: Debtor;

  constructor(
    private cachedObjectsService: CachedObjectsService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    if(!this.cachedObjectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.debtor = this.cachedObjectsService.debtor;
    // console.log(this.cachedObjectsService.debtor.company);

  }

}
