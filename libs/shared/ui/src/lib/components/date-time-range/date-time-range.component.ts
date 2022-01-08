import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addToDate, isNonNull } from '@irrigation/shared/util';
import { filter, map, Subject, takeUntil } from 'rxjs';

export interface DateRange {
  start: Date;
  end: Date;
}

@Component({
  selector: 'irrigation-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DateTimeRangeComponent implements OnInit, OnDestroy {
  /**
   * Helper for unsubscribing streams.
   */
  private readonly destroy$ = new Subject<void>();
  // Form control names as constants => handy
  public readonly startDateControlName = 'startDate';
  public readonly startTimeControlName = 'startTime';
  public readonly endDateControlName = 'endDate';
  public readonly endTimeControlName = 'endTime';
  public readonly form = new FormGroup({
    [this.startDateControlName]: new FormControl(null, Validators.required),
    [this.startTimeControlName]: new FormControl(null, Validators.required),
    [this.endDateControlName]: new FormControl(null, Validators.required),
    [this.endTimeControlName]: new FormControl(null, Validators.required),
  });

  public readonly _hours = [...Array(24).keys()];

  @Output()
  public readonly dateRangeChange = new EventEmitter<DateRange>();

  @Input()
  public set value(dateRange: DateRange) {
    if (isNonNull(dateRange)) {
      const [startCopy, startTime] = this._copyAndSplittDate(dateRange.start);
      const [endCopy, endTime] = this._copyAndSplittDate(dateRange.end);
      this.form.setValue({
        [this.startDateControlName]: startCopy,
        [this.startTimeControlName]: startTime,
        [this.endDateControlName]: endCopy,
        [this.endTimeControlName]: endTime,
      });
    } else this.form.reset();
  }

  public get value(): DateRange {
    return {
      start: addToDate(
        this.form.value[this.startDateControlName],
        0,
        0,
        0,
        this.form.value[this.startTimeControlName]
      ),
      end: addToDate(
        this.form.value[this.endDateControlName],
        0,
        0,
        0,
        this.form.value[this.endTimeControlName]
      ),
    };
  }

  public readonly valueChanges = this.dateRangeChange.asObservable();

  private _copyAndSplittDate(date: Date): [Date, number] {
    const copy = new Date(date);
    const time = copy.getHours();
    copy.setHours(0, 0, 0, 0);
    return [copy, time];
  }

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.form.valid),
        map(() => this.value)
      )
      .subscribe({ next: (change) => this.dateRangeChange.emit(change) });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
