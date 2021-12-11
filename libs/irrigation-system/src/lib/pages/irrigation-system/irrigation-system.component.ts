import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BookingService,
  IrrigationSystem,
  Pump,
} from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import {
  addToDate,
  isNonNull,
  isNullish,
  throwExpression,
} from '@irrigation/shared/util';
import { ROUTE_IRRIGATION_SYSTEM_OVERVIEW } from '../../routes/routes';
import { TimelineData } from '../../components/irrigation-timeline/irrigation-timeline.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'irrigation-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.scss'],
})
export class IrrigationSystemComponent implements OnInit {
  public static readonly QUERY_PARAM_ID = 'id';

  public irrigationSystem$!: Observable<IrrigationSystem>;
  public timelineData$!: Observable<TimelineData>;
  private _now = new Date();
  private _range_from_control_startValue = new Date(
    this._now.getFullYear(),
    this._now.getMonth(),
    this._now.getDate()
  );
  private _range_to_control_startValue = addToDate(
    this._range_from_control_startValue,
    0,
    0,
    1
  );
  public _hours = [...Array(24).keys()];

  public readonly _range_from_control = 'range_start';
  public readonly _range_to_control = 'range_end';
  public readonly _range = new FormGroup({
    [this._range_from_control]: new FormControl(
      this._range_from_control_startValue
    ),
    [this._range_to_control]: new FormControl(
      this._range_to_control_startValue
    ),
  });

  public readonly _booking_from_control = 'booking_from_date';
  public readonly _booking_from_time_control = 'booking_from_time';
  public readonly _booking_to_control = 'booking_to_date';
  public readonly _booking_to_time_control = 'booking_to_time';
  public readonly _booking = new FormGroup({
    [this._booking_from_control]: new FormControl(
      this._range_from_control_startValue,
      Validators.required
    ),
    [this._booking_from_time_control]: new FormControl(
      null,
      Validators.required
    ),
    [this._booking_to_control]: new FormControl(
      this._range_from_control_startValue,
      Validators.required
    ),
    [this._booking_to_time_control]: new FormControl(null, Validators.required),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: StoreService,
    private readonly router: Router,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.irrigationSystem$ = combineLatest([
      this.route.queryParams.pipe(
        pluck(IrrigationSystemComponent.QUERY_PARAM_ID)
      ),
      this.store.user$.pipe(filter(isNonNull)),
    ]).pipe(
      map(([id, user]) => {
        const irrigationSystem = user.irrigationSystems?.find(
          (x) => x.id === id
        );
        if (isNullish(irrigationSystem))
          this.router.navigate([`../${ROUTE_IRRIGATION_SYSTEM_OVERVIEW}`], {
            relativeTo: this.route,
          });
        return irrigationSystem;
      }),
      filter(isNonNull)
    );

    this.timelineData$ = this._range.valueChanges.pipe(
      startWith({
        [this._range_from_control]: this._range_from_control_startValue,
        [this._range_to_control]: this._range_to_control_startValue,
      }),
      filter(
        (value) =>
          isNonNull(value[this._range_from_control]) &&
          isNonNull(value[this._range_to_control])
      ),
      switchMap((value) =>
        this.irrigationSystem$.pipe(
          map((irrigationSystem) => irrigationSystem.pumps),
          filter(isNonNull),
          switchMap((pumps) =>
            forkJoin(
              pumps.map((pump) =>
                this.bookingService
                  .inPeriod(
                    pump.id,
                    (value[this._range_from_control] as Date).getTime(),
                    addToDate(value[this._range_to_control], 0, 0, 1).getTime()
                  )
                  .pipe(map((bookings) => ({ ...pump, bookings })))
              )
            )
          ),
          map((pumps) => ({
            from: value[this._range_from_control],
            to: addToDate(value[this._range_to_control], 0, 0, 1),
            pumps,
          }))
        )
      ),
      shareReplay(1)
    );
  }

  public _addBooking(): void {
    if (this._booking.valid)
      combineLatest([
        this.store.user$.pipe(filter(isNonNull)),
        this.timelineData$,
        of(this._booking.value),
      ])
        .pipe(
          take(1),
          map(
            ([user, timelineData, bookingFormValue]) =>
              [
                user,
                timelineData,
                addToDate(
                  new Date(bookingFormValue[this._booking_from_control]),
                  0,
                  0,
                  0,
                  bookingFormValue[this._booking_from_time_control]
                ).getTime(),
                addToDate(
                  new Date(bookingFormValue[this._booking_to_control]),
                  0,
                  0,
                  0,
                  bookingFormValue[this._booking_to_time_control]
                ).getTime(),
              ] as const
          ),
          switchMap(([user, timelineData, from, to]) =>
            this.bookingService.createBooking({
              from,
              to,
              by: user.id,
              pump: this._getBestPump(from, to, timelineData).id,
            })
          )
        )
        .subscribe({
          next: () => this._range.reset(this._range.value, { emitEvent: true }),
        });
  }

  private _getBestPump(
    _from: number,
    _to: number,
    timelineData: TimelineData
  ): Pump {
    return (
      timelineData.pumps.find(
        (pump) =>
          !pump.bookings.some(({ from, to }) => _to > from && _from < to)
      ) ?? throwExpression('No free slots')
    );
  }
}
