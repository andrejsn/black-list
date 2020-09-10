import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { DebtorStatus } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
})
export class DebtorComponent implements OnInit {
  company_name: string;
  debtorStatus = DebtorStatus;

  submitted: boolean = false;
  loading: boolean = false;

  addDebtorForm: FormGroup = new FormGroup({
    company: new FormControl(),
    reg_number: new FormControl(),
    // debt: new FormControl(),

    legal_address: new FormControl(),
    city: new FormControl(),
    postal_code: new FormControl(),
    country: new FormControl(),
    phone: new FormControl(),
    fax: new FormControl(),
    email: new FormControl(),
    homepage: new FormControl(),
    bank_name: new FormControl(),
    bank_account_number: new FormControl(),
    status: new FormControl(),
    note: new FormControl(),
  });

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // set browser title
    this.title.setTitle('Add debtor');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/add/debtor',
        name: 'add debtor',
        active: true,
      },
    ]);

    this.addDebtorForm = this.formBuilder.group({
      company: ['', [Validators.required]],
      reg_number: ['', [Validators.required]],
      // debt: ['', [Validators.required]],
      legal_address: [],
      city: [],
      postal_code: [],
      country: [],
      phone: [],
      fax: [],
      email: [],
      homepage: [],
      bank_name: [],
      bank_account_number: [],
      status: [null, [Validators.required]],
      note: [],
    });
  }

  /**
   * set company name in cards
   */
  changedCompanyName() {
    this.company_name = this.addDebtorForm.controls['company'].value;
  }

  /**
   * submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addDebtorForm.invalid) {
      this.translate
        .get('toast.error.debtor_form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;

    this.http
      .post<any>(`${environment.apiUrl}/debtor/store`, {
        company: this.addDebtorForm.controls['company'].value,
        reg_number: this.addDebtorForm.controls['reg_number'].value,
        // debt: this.addDebtorForm.controls['debt'].value,
        legal_address: this.addDebtorForm.controls['legal_address'].value,
        city: this.addDebtorForm.controls['city'].value,
        postal_code: this.addDebtorForm.controls['postal_code'].value,
        country: this.addDebtorForm.controls['country'].value,
        phone: this.addDebtorForm.controls['phone'].value,
        fax: this.addDebtorForm.controls['fax'].value,
        email: this.addDebtorForm.controls['email'].value,
        homepage: this.addDebtorForm.controls['homepage'].value,
        bank_name: this.addDebtorForm.controls['bank_name'].value,
        bank_account_number: this.addDebtorForm.controls['bank_account_number']
          .value,
        status: this.addDebtorForm.controls['status'].value,
        note: this.addDebtorForm.controls['note'].value,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          // TODO error?
          if (data.added) {
            this.router.navigate(['/debtors']);
          }
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

  // convenience getter for easy access to form fields
  get f() {
    return this.addDebtorForm.controls;
  }
}
