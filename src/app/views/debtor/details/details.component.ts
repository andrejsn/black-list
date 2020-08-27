import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ObjectsService } from '@app/shared/services';
import { Debtor } from '@app/models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  debtor: Debtor;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    if(!this.objectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.debtor = this.objectsService.debtor;
    // console.log(this.objectsService.debtor.company);

  }

}
