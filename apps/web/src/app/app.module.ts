import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@irrigation/shared/store';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
