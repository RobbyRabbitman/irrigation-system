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
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { UserGuard } from './routes/user.guard';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

registerLocaleData(localeDE);
export const LOCALE = 'de-DE';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ShellModule,
    MatNativeDateModule,
    HttpClientModule,
    StoreModule.forRoot(environment.api),
    RouterModule.forRoot([
      {
        path: 'irrigation-systems',
        loadChildren: () =>
          import('@irrigation/irrigation-system').then(
            (lib) => lib.IrrigationSystemModule
          ),
        canLoad: [UserGuard],
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@irrigation/auth').then((lib) => lib.AuthModule),
      },
      {
        path: '**',
        redirectTo: 'irrigation-systems',
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: LOCALE },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
