import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

enum Court { arbitration, state }

interface StateCourt {
  court: Court.state,
  name: string,
  addresse: string
}

enum Basis { product, services }

interface ContractClaimToCourt extends Contract {
  place: string, number: string, judgesNumber: number, court: Court, stateCourt: StateCourt, attachments: string[], claimToCourtDate: Date, basis: Basis, saveDoc: boolean
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
  selectedCourt:Court;


  submitted: boolean = false;
  loading: boolean = false;

  claimToCourtForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    judgesNumber: new FormControl(),

    basis: new FormControl(),
    court: new FormControl(),
    courtName: new FormControl(),

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
        judgesNumber: ['', [Validators.required, Validators.min(1)]],

        basis: [null, [Validators.required]],
        court: [null, [Validators.required]],
        courtName: ['', ''],

        claimToCourtDate: ['', [Validators.required]],
        saveDoc: ['', '']
      }
    );
    this.claimToCourtForm.patchValue({ saveDoc: true });
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

    this.contract.claimToCourtDate = this.claimToCourtForm.controls['warningDate'].value;
    this.contract.saveDoc = this.claimToCourtForm.controls['saveDoc'].value;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/claim/to/court`,
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




  // convenience getter for easy access to form fields
  get f() {
    return this.claimToCourtForm.controls;
  }
}

