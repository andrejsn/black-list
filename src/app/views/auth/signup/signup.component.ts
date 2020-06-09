import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  username: string;
  email: string;
  password: string;
  repeat_password: string;
  agree:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  signup() {
    console.log('signup ---');
    console.log('username: ' + this.username);
    console.log('email: ' + this.email);
    console.log('password: ' + this.password);
    console.log('repeat_password: ' + this.repeat_password);
    console.log('agree: ' + this.agree);

     console.log('----');

  }
}
