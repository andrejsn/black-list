import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';


enum Court { arbitration, state }

enum Basis { product, services }

interface ContractClaimToCourt extends Contract {
  place: string, number: string, judgesNumber: number, court: Court, courtName: string, courtAddress: string, attachments: string[], claimToCourtDate: Date, basis: Basis, saveDoc: boolean
}

@Component({
  selector: 'app-claim-to-court',
  templateUrl: './claim-to-court.component.html',
  styleUrls: ['./claim-to-court.component.css']
})
export class ClaimToCourtComponent implements OnInit {

  @Input() contract: ContractClaimToCourt;
  debtorBasis = Basis;
  courts = Court;
  selectedCourt: Court;
  apiUrl: string;


  submitted: boolean = false;
  loading: boolean = false;

  claimToCourtForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    judgesNumber: new FormControl(),

    basis: new FormControl(),
    court: new FormControl(),
    courtName: new FormControl(),
    courtAddress: new FormControl(),

    claimToCourtDate: new FormControl(new Date()),
    saveDoc: new FormControl()
  });


  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.claimToCourtForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        number: ['', Validators.required],
        claimToCourtDate: ['', [Validators.required]],

        basis: [null, [Validators.required]],
        court: [null, [Validators.required]],
        judgesNumber: ['', [Validators.required, Validators.min(1)]],
        courtName: ['', [Validators.required]],
        courtAddress: ['', [Validators.required]],

        attachments: this.formBuilder.array([this.formBuilder.group({ attachmentName: '' })]),
        saveDoc: ['', '']
      }
    );
    this.claimToCourtForm.patchValue({ judgesNumber: 1, saveDoc: true });
  }

  get attacmentNames() {
    return this.claimToCourtForm.get('attachments') as FormArray;
  }

  addAttachmentName() {
    this.attacmentNames.push(this.formBuilder.group({attachmentName: ''}));
  }

  deleteAttachmentName(index:number){
    this.attacmentNames.removeAt(index);
  }

  /**
  * submit form
  */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.claimToCourtForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    //this.loading = true;

    this.contract.place = this.claimToCourtForm.controls['place'].value;
    this.contract.number = this.claimToCourtForm.controls['number'].value;
    this.contract.judgesNumber = this.claimToCourtForm.controls['judgesNumber'].value;
    this.contract.basis = this.claimToCourtForm.controls['basis'].value;
    this.contract.court = this.claimToCourtForm.controls['court'].value;
    this.contract.courtName = this.claimToCourtForm.controls['courtName'].value;
    this.contract.courtAddress = this.claimToCourtForm.controls['courtAddress'].value;
    this.contract.claimToCourtDate = this.claimToCourtForm.controls['claimToCourtDate'].value;
    this.contract.saveDoc = this.claimToCourtForm.controls['saveDoc'].value;

    this.http.post<any>(`${environment.apiUrl}` + this.apiUrl,
      {
        'contract': this.contract
      }, { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {
          console.log(data);


          // window.open(window.URL.createObjectURL(data));
        },
        error => {


          console.log(error);


          this.loading = false;
          this.submitted = false;
          this.translate.get('toast.error.response').subscribe((error: string) => { this.snotifyService.error(error) });
        }
      );
  }


  selectCourt(_court) {
    this.selectedCourt = _court;
    this.f['judgesNumber'].setValue(this.f['judgesNumber'].value > 0 ? this.f['judgesNumber'].value : 1);

    if ((this.selectedCourt + '') == 'arbitration') {
      this.apiUrl = '/pdf/contract/claim/to/arbitration/court';

      this.f['courtName'].setValue(this.f['courtName'].value != '' ? this.f['courtName'].value : ' ');
      this.f['courtAddress'].setValue(this.f['courtAddress'].value != '' ? this.f['courtAddress'].value : ' ');
    } else {
      // state
      this.apiUrl = '/pdf/contract/claim/to/state/court';

      this.f['courtName'].setValue(this.f['courtName'].value == ' ' ? '' : this.f['courtName'].value);
      this.f['courtAddress'].setValue(this.f['courtAddress'].value == ' ' ? '' : this.f['courtAddress'].value);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.claimToCourtForm.controls;
  }
}

