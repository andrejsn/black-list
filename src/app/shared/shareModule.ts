import { NgModule, ModuleWithProviders } from '@angular/core';
import { EnumToArrayPipe } from './helpers';
// import { appDirective } from './{your-path}';
// import { appService } from './{your-path}';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    // appDirective
  ],
  exports: [
    EnumToArrayPipe,
    // appDirective
  ]
})
export class SharingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharingModule,
      // providers: [ appService ]
    };
  }
}
