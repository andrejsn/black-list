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

import { Debtor, Contract, Guarantor } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-guarantor',
  templateUrl: './guarantor.component.html',
  styleUrls: ['./guarantor.component.css'],
})
export class GuarantorComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  selectedGuarantor: Guarantor;

  editGuarantorForm = new FormGroup({
    name: new FormControl(),
    code: new FormControl(),
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
    if (
      !this.objectsService.debtor &&
      !this.objectsService.contract &&
      !this.objectsService.guarantor
    ) {
      // no debtor&contract&guarantor cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;
    this.selectedGuarantor = this.objectsService.guarantor;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- edit guarantor');
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
        name: 'Edit guarantor: ' + this.selectedGuarantor.name,
        active: true,
      },
    ]);

    // create validation
    this.editGuarantorForm = this.formBuilder.group({
      name: [this.selectedGuarantor.name, [Validators.required]],
      code: [this.selectedGuarantor.code, []],
      phone: [this.selectedGuarantor.phone, []],
      address: [this.selectedGuarantor.address, []],
      email: [this.selectedGuarantor.email, []],
    });
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editGuarantorForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(
        `${environment.apiUrl}/guarantor/update`,
        this.updateGuarantorValues()
      )
      .pipe(first())
      .subscribe(
        (data) => {
          // TODO: error?
          this.router.navigate(['/debtor/contracts']);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;

          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  private updateGuarantorValues() {
    return {
      id: this.selectedGuarantor.id,
      contract_id: this.selectedContract.id,
      name: this.editGuarantorForm.controls['name'].value,
      code: this.editGuarantorForm.controls['code'].value,
      phone: this.editGuarantorForm.controls['phone'].value,
      address: this.editGuarantorForm.controls['address'].value,
      email: this.editGuarantorForm.controls['email'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editGuarantorForm.controls;
  }
}
