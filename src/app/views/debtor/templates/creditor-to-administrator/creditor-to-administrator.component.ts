import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { Contract } from '@app/models';
import { environment } from '@environments/environment';

enum Basis {
  product,
  services,
}
interface Administrator {
  name: string;
  number: string;
  address: string;
}

interface ContractCreditorToAdministrator extends Contract {
  place: string;
  number: string;
  creditorToAdministratorDate: Date;
  insolvencyDate: Date;
  insolvencyRegisterEntryDate: Date;
  basis: Basis;
  administrator: Administrator;
  attachments: any;
  saveDoc: boolean;
}

@Component({
  selector: 'app-creditor-to-administrator',
  templateUrl: './creditor-to-administrator.component.html',
  styleUrls: ['./creditor-to-administrator.component.scss'],
})
export class CreditorToAdministratorComponent implements OnInit {
  @Input() contract: ContractCreditorToAdministrator;
  debtorBasis = Basis;

  submitted: boolean = false;
  loading: boolean = false;

  creditorToAdministratorForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    creditorToAdministratorDate: new FormControl(new Date()),
    insolvencyDate: new FormControl(new Date()),
    insolvencyRegisterEntryDate: new FormControl(new Date()),

    basis: new FormControl(),
    administratorName: new FormControl(),
    administratorNumber: new FormControl(),
    administratorAddress: new FormControl(),
    attachments: new FormControl(),

    saveDoc: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    this.contract.administrator = new Object() as Administrator;
    this.creditorToAdministratorForm = this.formBuilder.group({
      place: ['', [Validators.required]],
      number: ['', Validators.required],
      creditorToAdministratorDate: ['', [Validators.required]],

      insolvencyDate: ['', [Validators.required]],
      insolvencyRegisterEntryDate: ['', [Validators.required]],

      basis: [null, [Validators.required]],

      administratorName: [null, [Validators.required]],
      administratorNumber: [null, [Validators.required]],
      administratorAddress: [null, [Validators.required]],

      attachments: this.formBuilder.array([]),
      saveDoc: ['', ''],
    });
    // this.creditorToAdministratorForm.patchValue({ saveDoc: true });
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.creditorToAdministratorForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    //this.loading = true;

    this.contract.place = this.creditorToAdministratorForm.controls[
      'place'
    ].value;
    this.contract.number = this.creditorToAdministratorForm.controls[
      'number'
    ].value;
    this.contract.creditorToAdministratorDate = this.creditorToAdministratorForm.controls[
      'creditorToAdministratorDate'
    ].value;
    this.contract.basis = this.creditorToAdministratorForm.controls[
      'basis'
    ].value;
    this.contract.insolvencyDate = this.creditorToAdministratorForm.controls[
      'insolvencyDate'
    ].value;
    this.contract.insolvencyRegisterEntryDate = this.creditorToAdministratorForm.controls[
      'insolvencyRegisterEntryDate'
    ].value;

    this.contract.administrator.name = this.creditorToAdministratorForm.controls[
      'administratorName'
    ].value;
    this.contract.administrator.number = this.creditorToAdministratorForm.controls[
      'administratorNumber'
    ].value;
    this.contract.administrator.address = this.creditorToAdministratorForm.controls[
      'administratorAddress'
    ].value;

    this.contract.attachments = this.creditorToAdministratorForm.controls[
      'attachments'
    ].value;
    this.contract.saveDoc = this.creditorToAdministratorForm.controls[
      'saveDoc'
    ].value;

    this.http
      .post<any>(
        `${environment.apiUrl}/pdf/contract/creditor/to/administrator`,
        {
          contract: this.contract,
        },
        { responseType: 'blob' as 'json' }
      )
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);

          // window.open(window.URL.createObjectURL(data));
        },
        (error) => {
          console.log(error);

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

  get attachments() {
    return this.creditorToAdministratorForm.get('attachments') as FormArray;
  }

  addAttachment() {
    this.attachments.push(
      this.formBuilder.group({ name: ['', [Validators.required]] })
    );
  }

  deleteAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.creditorToAdministratorForm.controls;
  }
}
