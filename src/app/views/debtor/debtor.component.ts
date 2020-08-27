import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Debtor } from '@app/models';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.css']
})
export class DebtorComponent implements OnInit {
  debtor: Debtor;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.objectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.debtor = this.objectsService.debtor;

    // set browser title
    this.title.setTitle(this.debtor.company +  '- details');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      { route: '/debtor', name: 'Debtor: ' + this.debtor.company, active: true },
    ]);

  }

}
