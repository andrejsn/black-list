import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
