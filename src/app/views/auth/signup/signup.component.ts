import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SnotifyService } from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    password_confirmation: new FormControl(),
    agree: new FormControl()
  });

  returnUrl: string;
  submitted = false;
  loading = false;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snotifyService: SnotifyService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        name:
          ['',
            [
              Validators.required, Validators.minLength(3), Validators.maxLength(32)
            ]
          ],
        email:
          ['',
            [
              Validators.required, Validators.email
            ]
          ],
        password:
          ['',
            [
              Validators.required, Validators.minLength(8), Validators.maxLength(32)
            ]
          ],
        password_confirmation:
          [''],
        agree:
          [false, Validators.required]
      },
      { validator: this.checkPasswords }
    );
  }

  onSubmit() {
    this.submitted = true;

    console.log('submit +');

    const name = this.signupForm.controls['name'].value;
    const email = this.signupForm.controls['email'].value;
    const password = this.signupForm.controls['password'].value;
    const password_confirmation = this.signupForm.controls['password_confirmation'].value;
    const agree = this.signupForm.controls['agree'].value;



    // stop here if form is invalid
    if (this.signupForm.invalid) {
      this.translate.get('toast.auth.signup_form').subscribe((error:string) => {this.snotifyService.error(error)});

      return;
    }

    //this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/auth/signup`,
      {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': password_confirmation,
        'agree': agree
      }
    ).pipe(first())
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.translate.get('toast.auth.email_exist').subscribe((error:string) => {this.snotifyService.error(error)});
        }
      );
  }

  /*
  * check password confirm
  */
  checkPasswords(formGroup: FormGroup) {
    //
    const pass = formGroup.get('password').value;
    const confirmPass = formGroup.get('password_confirmation').value;

    return pass === confirmPass ? null : { notsame: true };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }
}
