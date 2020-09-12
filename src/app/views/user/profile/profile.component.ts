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
  user: User;

  submitted: boolean = false;
  loading: boolean = false;

  userForm: FormGroup = new FormGroup({
    company: new FormControl(),
    reg_number: new FormControl(),
    post: new FormControl(),
    name: new FormControl(),

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
    this.title.setTitle('edit my profile');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/user', name: 'User', active: true },
      { route: '/user/profile', name: 'Profile', active: true },
    ]);

    // get user profile
    this.http
      .post<any>(`${environment.apiUrl}/auth/me`, {})
      .pipe(first())
      .subscribe(
        (data) => {
          this.user = data as User;
          this.initValidators(this.user);
          // console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private initValidators(user: User) {
    // init validators
    this.userForm = this.formBuilder.group({
      company: [user.company, [Validators.required, Validators.maxLength(255)]],
      reg_number: [
        user.reg_number,
        [Validators.required, Validators.maxLength(255)],
      ],
      post: [user.post, [Validators.required, Validators.maxLength(255)]],
      name: [user.name, [Validators.required, Validators.maxLength(255)]],

      contact_person_post: [
        user.contact_person_post,
        [Validators.required, Validators.maxLength(255)],
      ],
      contact_person_name: [
        user.contact_person_name,
        [Validators.required, Validators.maxLength(255)],
      ],

      legal_address: [
        user.legal_address,
        [Validators.required, Validators.maxLength(255)],
      ],
      city: [user.city, [Validators.required, Validators.maxLength(255)]],
      postal_code: [
        user.postal_code,
        [Validators.required, Validators.maxLength(255)],
      ],
      country: [user.country, [Validators.required, Validators.maxLength(255)]],

      phone: [user.phone, [Validators.maxLength(255)]],
      fax: [user.fax, [Validators.maxLength(255)]],
      email: [
        user.email,
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      homepage: [user.homepage, [Validators.maxLength(255)]],

      bank_name: [
        user.bank_name,
        [Validators.required, Validators.maxLength(255)],
      ],
      bank_account_number: [
        user.bank_account_number,
        [Validators.required, Validators.maxLength(255)],
      ],
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
          if (data.updated && data.updated === true) {
            this.snotifyService.info('Profile is updated');
          }

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
      company: this.f['company'].value,
      reg_number: this.f['reg_number'].value,
      name: this.f['name'].value,
      post: this.f['post'].value,
      legal_address: this.f['legal_address'].value,
      city: this.f['city'].value,
      postal_code: this.f['postal_code'].value,
      country: this.f['country'].value,
      phone: this.f['phone'].value,
      fax: this.f['fax'].value,
      email: this.f['email'].value,
      homepage: this.f['homepage'].value,
      bank_name: this.f['bank_name'].value,
      bank_account_number: this.f['bank_account_number'].value,
      contact_person_name: this.f['contact_person_name'].value,
      contact_person_post: this.f['contact_person_post'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }
}
