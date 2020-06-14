import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  styles: ['.xxx {font-size: xxx-large;}'],
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(public translate: TranslateService) { }

  /*
   FIXME use i18n from cui
   */
  translateTo(language: string): void {

    var reports_re: RegExp;
    var debtors_re: RegExp;
    var add_debtor_re: RegExp;
    var calendar_re: RegExp;

    if (this.translate.currentLang === 'en') {
      // ATTENTION : this values sync to navigation list & en.json
      reports_re = /Reports/g;
      debtors_re = /Debtors/g;
      add_debtor_re = /Add Debtor/g;
      calendar_re = /Calendar/g;
    } else if (this.translate.currentLang === 'ru') {
      // ATTENTION : this values sync to ru.json
      reports_re = /Отчёты/g;
      debtors_re = /Должники/g;
      add_debtor_re = /добавить Должника/g;
      calendar_re = /Календарь/g;
    } else if (this.translate.currentLang === 'lv') {
      // ATTENTION : this values sync to lv.json
      reports_re = /Atskaites/g;
      debtors_re = /Parādnieki/g;
      add_debtor_re = /pievienot Parādnieku/g;
      calendar_re = /Kalendārs/g;
    }

    console.log('switch to' + language);

    this.translate.use(language);

    var reports: Element = document.getElementsByTagName('app-sidebar-nav-link').item(0);
    var debtors: Element = document.getElementsByTagName('app-sidebar-nav-link').item(1);
    var add_debtor: Element = document.getElementsByTagName('app-sidebar-nav-link').item(2);
    var calendar: Element = document.getElementsByTagName('app-sidebar-nav-link').item(3);


    this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { reports.innerHTML = reports.innerHTML.replace(reports_re, res); })
    this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { debtors.innerHTML = debtors.innerHTML.replace(debtors_re, res); })
    this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { add_debtor.innerHTML = add_debtor.innerHTML.replace(add_debtor_re, res); })
    this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { calendar.innerHTML = calendar.innerHTML.replace(calendar_re, res); })
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

}
