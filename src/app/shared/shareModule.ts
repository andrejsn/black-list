import { NgModule, ModuleWithProviders } from '@angular/core';
import { EnumToArrayPipe } from './helpers';
// import { appDirective } from './{your-path}';
// import { appService } from './{your-path}';

// fixed error: https://stackoverflow.com/questions/62755093/angular-error-generic-type-modulewithproviderst-requires-1-type-arguments
declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  declarations: [
    EnumToArrayPipe,
    // appDirective
  ],
  exports: [
    EnumToArrayPipe,
    // appDirective
  ],
})
export class SharingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharingModule,
      // providers: [ appService ]
    };
  }
}
