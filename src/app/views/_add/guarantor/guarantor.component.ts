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

  addGuarantorForm = new FormGroup({
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
    if (!this.objectsService.debtor && !this.objectsService.contract) {
      // no debtor&contract cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add guarantor');
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
        route: '/add/guarantor',
        name: 'Add guarantor',
        active: true,
      },
    ]);

    // create validation
    this.addGuarantorForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', []],
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
    if (this.addGuarantorForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    const storedGuarantor = this.initNewGuarantor();
    this.http
      .post<any>(`${environment.apiUrl}/guarantor/store`, storedGuarantor)
      .pipe(first())
      .subscribe(
        (data) => {
          this.objectsService.guarantor = storedGuarantor;
          this.router.navigate(['/debtor/contracts']);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.objectsService.guarantor = null;
          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  private initNewGuarantor(): Guarantor {
    return {
      contract_id: this.selectedContract.id,
      name: this.f['name'].value,
      code: this.f['code'].value,
      phone: this.f['phone'].value,
      address: this.f['address'].value,
      email: this.f['email'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addGuarantorForm.controls;
  }
}
