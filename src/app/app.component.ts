import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<ng-http-loader></ng-http-loader><router-outlet></router-outlet><ng-snotify></ng-snotify>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
    public translate: TranslateService) {
    translate.addLangs(['en', 'ru', 'lv', 'de']);
    // translate.setDefaultLang('en');
    translate.setDefaultLang('ru');

    const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/ru|lv/) ? browserLang : 'en');
    translate.use('ru');
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
