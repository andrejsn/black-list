import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../shared/services/authentication/authentication-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  returnUrl: string;
  submitted = false;
  loading = false;

  constructor
  (
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
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
      },
    );
  }

  onSubmit() {
    this.submitted = true;

    console.log('login +');

    const email = this.signupForm.controls['email'].value;
    const password = this.signupForm.controls['password'].value;

    this.authenticationService.login(email, password);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }
}
