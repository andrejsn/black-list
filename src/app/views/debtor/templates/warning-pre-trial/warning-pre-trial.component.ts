import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { base64StringToBlob } from 'blob-util';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract, DocumentTableElement  } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation, requiredIfValidator } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-warning-pre-trial',
  templateUrl: './warning-pre-trial.component.html',
  styleUrls: ['./warning-pre-trial.component.scss'],
  animations: [inOutAnimation()]
})
export class WarningPreTrialComponent implements OnInit {
  @Input() contract: Contract;
  documentsList: DocumentTableElement[] = [];
  templateFileName: string;

  submitted: boolean = false;
  loading: boolean = false;

  warningPreTrialForm = new FormGroup({
    place: new FormControl(),
    warningPreTrialNumber: new FormControl(),
    within_days: new FormControl(),
    warningPreTrialDate: new FormControl(new Date()),
    isSaveToDocs: new FormControl(),
    documentDescription: new FormControl()
  });

  constructor(
    private formBuilder: FormBuilder,
    private objectsService: ObjectsService,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) { }

  ngOnInit(): void {
    this.objectsService
      .getDocumentTable()
      .subscribe((documentsList) => (this.documentsList = documentsList));

      this.translate.get('template.warning-pre-trial.pdf')
      .subscribe((templateFileName: string) => { this.templateFileName = templateFileName; });

    this.warningPreTrialForm.patchValue({ isSaveToDocs: false });
    this.warningPreTrialForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        warningPreTrialNumber: ['', Validators.required],
        within_days: ['', [Validators.required, Validators.min(1)]],
        warningPreTrialDate: ['', [Validators.required]],
        isSaveToDocs: ['', ''],
        documentDescription: ['', [
        Validators.minLength(3),
        Validators.maxLength(128),
        requiredIfValidator(() => this.f['isSaveToDocs'].value)
      ]]
      }
    );

    this.f['isSaveToDocs'].valueChanges.subscribe(
      value => { this.f['documentDescription'].updateValueAndValidity(); }
    );
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.warningPreTrialForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    // this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/warning/pretrial`,
      {
        contract_id: this.contract.id,
        document_place: this.f['place'].value,
        warning_pre_trial_number: this.f['warningPreTrialNumber'].value,
        warning_pre_trial_date: this.f['warningPreTrialDate'].value,
        within_days: this.f['within_days'].value,
        save_doc: this.f['isSaveToDocs'].value,
        document_file_name: this.templateFileName,
        document_description: this.f['documentDescription'].value
      },
      // { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {
          //
          if (this.f['isSaveToDocs'].value) {
            // add new PDF to document list
            this.documentsList.push(
              {
                id: data.document.id,
                file_name: data.document.file_name,
                description: data.document.description,
                toDelete: false,
                updated_at: data.document.updated_at,
                visible: false
              }
            );
            this.objectsService.setDocumentTable(this.documentsList);
            this.snotifyService.info('Document added to my docs');
          } else {
          // create new window  with document
          const contentType = 'application/pdf';
          const b64data = data.pdf;
          const blob = base64StringToBlob(b64data, contentType);

          window.open(window.URL.createObjectURL(blob));
          }
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
    return this.warningPreTrialForm.controls;
  }
}
