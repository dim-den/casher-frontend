import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INTERCEPTORS } from './interceptors';
import { DI } from './constants';
import { AuthGuard } from './guards';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [...APP_INTERCEPTORS, AuthGuard],
})
export class CoreModule {
  constructor(private injector: Injector) {
    DI.setup(this.injector);
  }
}
