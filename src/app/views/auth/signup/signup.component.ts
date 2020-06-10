import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
    password_confirmation: new FormControl()
  });

  returnUrl: string;
  submitted = false;
  loading = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {

  }

}
