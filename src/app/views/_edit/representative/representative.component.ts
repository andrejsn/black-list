import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
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

  editRepresentativeForm = new FormGroup({
    representativeName: new FormControl(),
    representativeCode: new FormControl(),
    representativePosition: new FormControl(),
    representativePhone: new FormControl(),
    representativeAddress: new FormControl(),
    representativeEmail: new FormControl(),
  });

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
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
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;
    this.selectedRepresentative = this.objectsService.representative;

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
        route: '/contract',
        name: 'Contract: ' + this.selectedContract.number,
        active: true,
      },
      {
        route: '/edit/representative',
        name: 'Edit representative: ' + this.selectedRepresentative.name,
        active: true,
      },
    ]);

    // create validation
    this.editRepresentativeForm = this.formBuilder.group({
      representativeName: ['', [Validators.required]],
      representativeCode: ['', [Validators.required]],
      representativePosition: ['', [Validators.required]],
      representativePhone: ['', [Validators.required]],
      representativeAddress: ['', [Validators.required]],
      representativeEmail: ['', [Validators.required]],
    });
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editRepresentativeForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editRepresentativeForm.controls;
  }
}
