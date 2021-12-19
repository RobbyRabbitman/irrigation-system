import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public constructor(private readonly dialog: MatDialog) {}

  public showErrorInDialog(error: Error): Observable<void> {
    return this.dialog
      .open(ErrorDialogComponent, { data: error })
      .afterClosed();
  }
}
