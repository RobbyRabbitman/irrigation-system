import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeRangeComponent } from './components/date-time-range/date-time-range.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  declarations: [DateTimeRangeComponent],
  exports: [DateTimeRangeComponent],
})
export class UiModule {}
