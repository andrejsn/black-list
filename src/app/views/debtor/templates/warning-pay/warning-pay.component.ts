import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-warning-pay',
  templateUrl: './warning-pay.component.html',
  styleUrls: ['./warning-pay.component.scss']
})
export class WarningPayComponent implements OnInit {
  @Input() contract: Contract;

  submitted: boolean = false;
  loading: boolean = false;

  warningPayForm = new FormGroup({
    place: new FormControl(),
    warningNumber: new FormControl(),
    within_days: new FormControl(),
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
        warningNumber: ['', Validators.required],
        within_days: ['', [Validators.required, Validators.min(1)]],
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

    // this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/warning`,
      {
        contract_id: this.contract.id,
        document_place: this.f['place'].value,
        warning_number: this.f['warningNumber'].value,
        warning_date: this.f['warningDate'].value,
        within_days: this.f['within_days'].value,
        save_doc: this.f['saveDoc'].value
      }, { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {
          // console.log(data);


          window.open(window.URL.createObjectURL(data));
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
