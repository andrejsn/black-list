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
    if (
      !this.objectsService.debtor &&
      !this.objectsService.contract &&
      !this.objectsService.representative
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
      name: [this.selectedRepresentative.name, [Validators.required]],
      code: [
        this.selectedRepresentative.code,
        [
          /*Validators.required*/
        ],
      ],
      position: [
        this.selectedRepresentative.position,
        [
          /*Validators.required*/
        ],
      ],
      phone: [
        this.selectedRepresentative.phone,
        [
          /*Validators.required*/
        ],
      ],
      address: [
        this.selectedRepresentative.address,
        [
          /*Validators.required*/
        ],
      ],
      email: [
        this.selectedRepresentative.email,
        [
          /*Validators.required*/
        ],
      ],
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

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/representative/update`, this.updateRepresentative())
      .pipe(first())
      .subscribe(
        (data) => {
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

  private updateRepresentative() {
    return {
      id: this.selectedRepresentative.id,
      contract_id: this.selectedContract.id,
      name: this.editRepresentativeForm.controls['name'].value,
      code: this.editRepresentativeForm.controls['code'].value,
      position: this.editRepresentativeForm.controls['position'].value,
      phone: this.editRepresentativeForm.controls['phone'].value,
      address: this.editRepresentativeForm.controls['address'].value,
      email: this.editRepresentativeForm.controls['email'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editRepresentativeForm.controls;
  }
}
