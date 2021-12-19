import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpStatusCodeInterceptor } from './interceptors/http-status-code.interceptor';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [ErrorDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpStatusCodeInterceptor,
      multi: true,
    },
  ],
})
export class ErrorModule {}
