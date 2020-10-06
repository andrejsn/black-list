import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { base64StringToBlob } from 'blob-util';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { Contract, DocumentTableElement } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation, requiredIfValidator } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-debt-calculation',
  templateUrl: './debt-calculation.component.html',
  styleUrls: ['./debt-calculation.component.scss'],
  animations: [inOutAnimation()]
})
export class DebtCalculationComponent implements OnInit {
  @Input() contract: Contract;
  documentsList: DocumentTableElement[] = [];
  templateFileName: string;

  submitted: boolean = false;
  loading: boolean = false;

  calcPayForm = new FormGroup({
    calcDate: new FormControl(new Date()),
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

  ngOnInit(): void { // TODO: validate contract date <= calc date
    this.objectsService
      .getDocumentTable()
      .subscribe((documentsList) => (this.documentsList = documentsList));

    this.translate.get('template.debt-calculation.pdf')
      .subscribe((templateFileName: string) => { this.templateFileName = templateFileName; });

    this.calcPayForm.patchValue({ isSaveToDocs: false });
    this.calcPayForm = this.formBuilder.group({
      calcDate: ['', [Validators.required]],
      isSaveToDocs: ['', ''],
      documentDescription: ['', [
        Validators.minLength(3),
        Validators.maxLength(128),
        requiredIfValidator(() => this.f['isSaveToDocs'].value)
      ]]
    });

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
    if (this.calcPayForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // this.loading = true;

    this.http
      .post<any>(
        `${environment.apiUrl}/pdf/contract/calc`,
        {
          contract_id: this.contract.id,
          calc_date: this.f['calcDate'].value,
          save_doc: this.f['isSaveToDocs'].value,
          document_file_name: this.templateFileName,
          document_description: this.f['documentDescription'].value
        },
        // { responseType: 'blob' as 'json' }
      )
      .pipe(first())
      .subscribe(
        (data) => {
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
          }
          //
          const contentType = 'application/pdf';
          const b64data = data.pdf;
          const blob = base64StringToBlob(b64data, contentType);

          window.open(window.URL.createObjectURL(blob));
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

  // convenience getter for easy access to form fields
  get f() {
    return this.calcPayForm.controls;
  }
}
