import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@irrigation/shared/store';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellModule } from '@irrigation/shell';
import { MatNativeDateModule } from '@angular/material/core';

export const LOCALE = 'de-DE';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ShellModule,
    MatNativeDateModule,
    HttpClientModule,
    StoreModule.forRoot(environment.api),
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () =>
          import('@irrigation/irrigation-system').then(
            (lib) => lib.IrrigationSystemModule
          ),
      },
    ]),
    BrowserAnimationsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: LOCALE }],
  bootstrap: [AppComponent],
})
export class AppModule {}
