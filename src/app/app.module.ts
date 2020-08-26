import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AuthenticationService } from '@shared/helpers/authentication/';
import { AuthenticationInterceptor } from '@shared/helpers/interceptors/';
import { ErrorInterceptor } from '@shared/helpers/interceptors/';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: false,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '',
  nullable: true,
  min: 0,
  max: 999999999.99,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

// Import your AvatarModule
import { AvatarModule } from 'ngx-avatar';
//
import { CurrentlyTitleService } from '@shared/services';
import { ShortenTextPipe } from './shared/helpers/pipes/shorten-text.pipe';
import { EnumToArrayPipe } from '@shared/helpers/';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { lvLocale } from 'ngx-bootstrap/locale';
defineLocale('lv', lvLocale);

import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';

registerLocaleData(localeLv);

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/');
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SnotifyModule,
    NgHttpLoaderModule.forRoot(),
    // tslint:disable-next-line: max-line-length
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AvatarModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  declarations: [AppComponent, ...APP_CONTAINERS, P404Component, P500Component],
  exports: [TranslateModule],
  providers: [
    Title,
    AuthenticationService, // ?
    CurrentlyTitleService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    SnotifyService,
    {
      provide: 'SnotifyToastConfig',
      useValue: ToastDefaults,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('lv');
  }
}
