import { Component, AfterViewInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { navI18n, navItems } from '@app/_nav';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  styles: ['.xxx {font-size: xxx-large;}'],
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements AfterViewInit {
  public sidebarMinimized = false;
  public navItems = navItems;

  // menu elements
  reports: Element;
  debtors: Element;
  add_debtor: Element;
  calendar: Element;
  // breadcump menu active
  active: string = '';



  constructor(private translate: TranslateService, private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        const url: string = event.url;
        if (url === '/' || url === navItems[0].url) {
          this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.active = res; });
        } else if (url === navItems[1].url) {
          this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.active = res; });
        } else if (url === navItems[2].url) {
          this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.active = res; });
        } else if (url === navItems[3].url) {
          this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.active = res; });
        }
      }

    });
  }


  ngAfterViewInit(): void {
    const elements = document.getElementsByTagName('app-sidebar-nav-link-content');

    this.reports = elements.item(0);
    this.debtors = elements.item(1);
    this.add_debtor = elements.item(2);
    this.calendar = elements.item(3);

    this.translate.use(this.translate.currentLang);
    this.translateTo(this.translate.currentLang);
  }

  /*
   FIXME use i18n from cui, if exist?
   */
  translateTo(language: string): void {
    this.translate.use(language);
    // translate menu
    this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.reports.innerHTML = this.reports.innerHTML.replace(navI18n[0], res); })
    this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.debtors.innerHTML = this.debtors.innerHTML.replace(navI18n[1], res); })
    this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.add_debtor.innerHTML = this.add_debtor.innerHTML.replace(navI18n[2], res); })
    this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.calendar.innerHTML = this.calendar.innerHTML.replace(navI18n[3], res); })
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

}
