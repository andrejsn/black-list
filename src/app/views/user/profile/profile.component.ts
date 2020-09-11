import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { User } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
    private title: Title,
    private objectsService: ObjectsService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // set browser title
    this.title.setTitle('edit user profile');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/user', name: 'User', active: true },
      { route: '/user/profile', name: 'Profile', active: true },
    ]);

    // init validators
    this.userForm = this.formBuilder.group({
      company: ['', []],
      reg_number: ['', []],
      user_post: ['', []],
      user_name: ['', [Validators.required]],

      contact_person_post: ['', []],
      contact_person_name: ['', []],

      legal_address: ['', []],
      city: ['', []],
      postal_code: ['', []],
      country: ['', []],

      phone: ['', []],
      fax: ['', []],
      email: ['', [Validators.required, Validators.email]],
      homepage: ['', []],

      bank_name: ['', []],
      bank_account_number: ['', []],
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
      this.translate.get('toast.error.user_form').subscribe((error: string) => {
        this.snotifyService.error(error);
      });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/user/update`, this.updatedUser())
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
this.loading = false;
          this.submitted = false;
          // TODO error?
          // if (data.added) {
          //   this.router.navigate(['/debtors']);
          // }
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

  private updatedUser(): User {
    return {
      name: 'hi',
      company: this.f['company'].value,
      reg_number: this.userForm.controls['reg_number'].value,
      // debt: this.userForm.controls['debt'].value,
      legal_address: this.userForm.controls['legal_address'].value,
      city: this.userForm.controls['city'].value,
      postal_code: this.userForm.controls['postal_code'].value,
      country: this.userForm.controls['country'].value,
      phone: this.userForm.controls['phone'].value,
      fax: this.userForm.controls['fax'].value,
      email: this.userForm.controls['email'].value,
      homepage: this.userForm.controls['homepage'].value,
      bank_name: this.userForm.controls['bank_name'].value,
      bank_account_number: this.userForm.controls['bank_account_number'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }
}
