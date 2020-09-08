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

import { Debtor, Contract, Representative } from '@app/models';
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

  addRepresentativeForm = new FormGroup({
    name: new FormControl(),
    code: new FormControl(),
    position: new FormControl(),
    phone: new FormControl(),
    address: new FormControl(),
    email: new FormControl(),
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
    if (!this.objectsService.debtor && !this.objectsService.contract) {
      // no debtor&contract cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add representative');
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
        route: '/add/representative',
        name: 'Add represantive',
        active: true,
      },
    ]);

    // create validation
    this.addRepresentativeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', []],
      position: ['', []],
      phone: ['', []],
      address: ['', []],
      email: ['', []],
    });
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addRepresentativeForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    const storedRepresantive = this.initNewRepresentative();
    this.http
      .post<any>(
        `${environment.apiUrl}/representative/store`,
        storedRepresantive
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.objectsService.representative = storedRepresantive;
          this.router.navigate(['/debtor/contracts']);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.objectsService.representative = null;
          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  private initNewRepresentative(): Representative {
    return {
      contract_id: this.selectedContract.id,
      name: this.addRepresentativeForm.controls['name'].value,
      code: this.addRepresentativeForm.controls['code'].value,
      position: this.addRepresentativeForm.controls['position'].value,
      phone: this.addRepresentativeForm.controls['phone'].value,
      address: this.addRepresentativeForm.controls['address'].value,
      email: this.addRepresentativeForm.controls['email'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addRepresentativeForm.controls;
  }
}
