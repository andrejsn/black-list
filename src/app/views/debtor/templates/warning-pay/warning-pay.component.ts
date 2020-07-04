import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';


interface ContractWarningPay extends Contract {
  place: string, number: string, days: string, warningDate: Date, saveDoc: boolean
}

@Component({
  selector: 'app-warning-pay',
  templateUrl: './warning-pay.component.html',
  styleUrls: ['./warning-pay.component.css']
})
export class WarningPayComponent implements OnInit {

  @Input() contract: ContractWarningPay;

  submitted: boolean = false;
  loading: boolean = false;

  warningPayForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    days: new FormControl(),
    warningDate: new FormControl(new Date()),
    saveDoc: new FormControl()
  });


  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.warningPayForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        number: ['', Validators.required],
        days: ['', [Validators.required, Validators.min(1)]],
        warningDate: ['', [Validators.required]],
        saveDoc: ['', '']
      }
    );
    this.warningPayForm.patchValue({ saveDoc: true });
  }
  /**
     * submit form
     */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.warningPayForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    this.loading = true;

    this.contract.place = this.warningPayForm.controls['place'].value;
    this.contract.number = this.warningPayForm.controls['number'].value;
    this.contract.days = this.warningPayForm.controls['days'].value;
    this.contract.warningDate = this.warningPayForm.controls['warningDate'].value;
    this.contract.saveDoc = this.warningPayForm.controls['saveDoc'].value;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/warning`,
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
    return this.warningPayForm.controls;
  }
}
