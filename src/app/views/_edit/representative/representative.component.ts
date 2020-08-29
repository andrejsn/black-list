import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';

import { Debtor, Task, Representative, Contract } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.css'],
})
export class RepresentativeComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  selectedRepresentative: Representative;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (
      !this.objectsService.representative &&
      !this.objectsService.contract &&
      !this.objectsService.debtor
    ) {
      // no debtor&contract&representative cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedRepresentative = this.objectsService.representative;
    this.selectedDebtor = this.objectsService.debtor;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- edit representative');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      {
        route: '/edit/representative',
        name: 'Representative: ' + this.selectedRepresentative.name,
        active: true,
      },
    ]);
  }
}
