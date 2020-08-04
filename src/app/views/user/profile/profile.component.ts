import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  company_name: string;

  submitted: boolean = false;
  loading: boolean = false;

  userForm: FormGroup = new FormGroup({
    company: new FormControl(),
    reg_number: new FormControl(),
    user_post: new FormControl(),
    user_name: new FormControl(),

    contact_person_post: new FormControl(),
    contact_person_name: new FormControl(),

    legal_address: new FormControl(),
    city: new FormControl(),
    postal_code: new FormControl(),
    country: new FormControl(),

    phone: new FormControl(),
    fax: new FormControl(),
    email: new FormControl(),
    homepage: new FormControl(),

    bank_name: new FormControl(),
    bank_account_number: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      company: ['', [Validators.required]],
      reg_number: ['', [Validators.required]],
      user_post: ['', [Validators.required]],
      user_name: ['', [Validators.required]],

      contact_person_post: ['', [Validators.required]],
      contact_person_name: ['', [Validators.required]],

      legal_address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      country: ['', [Validators.required]],

      phone: ['', [Validators.required]],
      fax: ['', [Validators.required]],
      email: ['', [Validators.required]],
      homepage: ['', [Validators.required]],

      bank_name: ['', [Validators.required]],
      bank_account_number: ['', [Validators.required]],
    });
  }

  /**
   * set company name in cards
   */
  changedUserName() {
    this.company_name = this.userForm.controls['company'].value;
  }

  /**
   * submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      this.translate
        .get('toast.error.user_form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // this.loading = true;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }
}
