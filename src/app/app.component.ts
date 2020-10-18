import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<ng-http-loader></ng-http-loader><router-outlet></router-outlet><ng-snotify></ng-snotify>'
})
export class AppComponent implements OnInit {
  constructor(
    private titleService: Title,
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.translate.addLangs(['en', 'ru', 'lv', 'de']);
    // TODO: set default 'en' after debuging
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use('ru');
    // TODO: set use from browser again - after debuging
    // translate.use(browserLang.match(/ru|lv/) ? browserLang : 'en');

    this.translate.get('title').subscribe((title: string) => {
      this.titleService.setTitle(title);
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
