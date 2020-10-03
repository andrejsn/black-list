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

enum Court {
  arbitration,
  state,
}

enum Basis {
  product,
  services,
}


@Component({
  selector: 'app-claim-to-court',
  templateUrl: './claim-to-court.component.html',
  styleUrls: ['./claim-to-court.component.scss'],
})
export class ClaimToCourtComponent implements OnInit {
  @Input() contract: Contract;
  debtorBasis = Basis;
  courts = Court;
  selectedCourt: Court;
  isArbitration: boolean;

  submitted: boolean = false;
  loading: boolean = false;

  claimToCourtForm = new FormGroup({
    place: new FormControl(),
    claimToCourtlNumber: new FormControl(),
    judgesNumber: new FormControl(),

    basis: new FormControl(),
    court: new FormControl(),
    courtName: new FormControl(),
    courtAddress: new FormControl(),
    attachments: new FormControl(),

    claimToCourtDate: new FormControl(new Date()),
    saveDoc: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) { }

  ngOnInit(): void {
    this.isArbitration = false;
    this.claimToCourtForm = this.formBuilder.group({
      place: ['', [Validators.required]],
      claimToCourtlNumber: ['', Validators.required],
      claimToCourtDate: ['', [Validators.required]],

      basis: [null, [Validators.required]],
      court: [null, [Validators.required]],
      judgesNumber: ['', [Validators.required, Validators.min(1)]],
      courtName: ['', [Validators.required]],
      courtAddress: ['', [Validators.required]],

      attachments: this.formBuilder.array([]),
      saveDoc: ['', ''],
    });
    this.claimToCourtForm.patchValue({ judgesNumber: 1, /*saveDoc: true*/ });
  }

  get attachments() {
    return this.claimToCourtForm.get('attachments') as FormArray;
  }

  addAttachment() {
    this.attachments.push(
      this.formBuilder.group({ name: ['', [Validators.required]] })
    );
  }

  deleteAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.claimToCourtForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // this.loading = true;

    if (this.isArbitration) {
      this.arbitration();
    } else {
      // state
      this.state();
    }

    // this.contract.place = this.f['place'].value;
    // this.contract.number = this.f['number'].value;
    // this.contract.judgesNumber = this.f['judgesNumber'].value;
    // this.contract.basis = this.f['basis'].value;
    // this.contract.court = this.f['court'].value;
    // this.contract.courtName = this.f['courtName'].value;
    // this.contract.courtAddress = this.f['courtAddress'].value;
    // this.contract.claimToCourtDate = this.f['claimToCourtDate'].value;
    // this.contract.attachments = this.f['attachments'].value;
    // this.contract.saveDoc = this.f['saveDoc'].value;


  }

  /**
   * create PDF for arbitration
   */
  private arbitration() {
    this.http
      .post<any>(
        `${environment.apiUrl}/pdf/contract/claim/to/arbitration/court`,
        {
          contract_id: this.contract.id,
          document_place: this.f['place'].value,
          claim_to_court_number: this.f['claimToCourtlNumber'].value,
          claim_to_court_date: this.f['claimToCourtDate'].value,
          debt_basis: this.f['basis'].value,
          judges_number: this.f['judgesNumber'].value,
          attachments: this.f['attachments'].value
        },
        { responseType: 'blob' as 'json' }
      )
      .pipe(first())
      .subscribe(
        (data) => {

          window.open(window.URL.createObjectURL(data));
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

  private state() {
    this.http
      .post<any>(
        `${environment.apiUrl}/pdf/contract/claim/to/state/court`,
        {

        },
        { responseType: 'blob' as 'json' }
      )
      .pipe(first())
      .subscribe(
        (data) => {

          window.open(window.URL.createObjectURL(data));
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


  selectCourt(_court) {
    this.selectedCourt = _court;
    this.f['judgesNumber'].setValue(
      this.f['judgesNumber'].value > 0 ? this.f['judgesNumber'].value : 1
    );

    if (this.selectedCourt + '' == 'arbitration') {
      this.isArbitration = true;

      this.f['courtName'].setValue(
        this.f['courtName'].value != '' ? this.f['courtName'].value : ' '
      );
      this.f['courtAddress'].setValue(
        this.f['courtAddress'].value != '' ? this.f['courtAddress'].value : ' '
      );
    } else {
      // state
      this.isArbitration = false;

      this.f['courtName'].setValue(
        this.f['courtName'].value == ' ' ? '' : this.f['courtName'].value
      );
      this.f['courtAddress'].setValue(
        this.f['courtAddress'].value == ' ' ? '' : this.f['courtAddress'].value
      );
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.claimToCourtForm.controls;
  }
}
