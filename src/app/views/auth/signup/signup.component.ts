import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    password_confirmation: new FormControl(),
    agree: new FormControl()
  });

  returnUrl: string;
  submitted = false;
  loading = false;


  constructor(private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        username:
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
          ['',
            [
              Validators.required
            ]
          ],
          agree:
          [false, Validators.required]
      },
      { validator: this.checkPasswords }
    );
  }

  onSubmit() {

    console.log('submit +');


    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {

      console.log('the form is invalid');


      return;
    }

  }

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
