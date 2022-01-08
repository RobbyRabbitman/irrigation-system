import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Booking,
  BookingService,
  IrrigationSystem,
  Pump,
} from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  finalize,
  forkJoin,
  map,
  Observable,
  of,
  pluck,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
} from 'rxjs';
import {
  addToDate,
  isNonNull,
  isNullish,
  throwExpression,
  throwIfNullish,
} from '@irrigation/shared/util';
import { ROUTE_IRRIGATION_SYSTEM_OVERVIEW } from '../../routes/routes';
import { TimelineData } from '../../components/irrigation-timeline/irrigation-timeline.component';
import { ErrorService } from '@irrigation/shared/error';
import { DateRange, DateTimeRangeComponent } from '@irrigation/shared/ui';

@Component({
  selector: 'irrigation-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IrrigationSystemComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public static readonly QUERY_PARAM_ID = 'id';

  private readonly destroy$ = new Subject<void>();

  @ViewChild('dateRange')
  public dateRange!: DateTimeRangeComponent;
  @ViewChild('addDateRange')
  public addDateRange!: DateTimeRangeComponent;

  private readonly now = new Date();
  public dateRangeDefaultValue: DateRange = {
    start: this.now,
    end: addToDate(this.now, 0, 0, 1),
  };
  public adddateRangeDefaultValue: DateRange = {
    start: this.now,
    end: addToDate(this.now, 0, 0, 0, 1),
  };

  public selectedBooking?: Booking;
  public irrigationSystem$!: Observable<IrrigationSystem>;
  private _timelineData$ = new BehaviorSubject<TimelineData | undefined>(
    undefined
  );
  public timelineData$ = this._timelineData$
    .asObservable()
    .pipe(shareReplay(1));

  public isAdding = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: StoreService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    private readonly bookingService: BookingService
  ) {}

  public ngOnInit(): void {
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
  }

  public ngAfterViewInit(): void {
    this.dateRange.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.dateRange.value),
        switchMap((dateRange) => this.updateTimeLine(dateRange))
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateTimeLine({ start, end }: DateRange): Observable<void> {
    return this.irrigationSystem$.pipe(
      take(1),
      map(({ pumps }) => pumps ?? []),
      // fetch bookings for every pump
      switchMap((pumps) =>
        forkJoin(
          pumps.map((pump) =>
            this.bookingService
              .inPeriod(pump.id, start.getTime(), end.getTime())
              // update bookings for pump
              .pipe(map((bookings) => ({ ...pump, bookings })))
          )
        )
      ),
      // map to timelinedata
      map((pumps) => ({
        from: start,
        to: end,
        pumps,
      })),
      // set timeline data
      map((timelineData) => this._timelineData$.next(timelineData))
    );
  }

  public _deleteBooking(): void {
    this.bookingService
      .deleteBooking(throwIfNullish(this.selectedBooking?.id))
      .pipe(switchMapTo(this.refreshTimelineData()))
      .subscribe({ next: () => (this.selectedBooking = undefined) });
  }

  public _onAddBooking(dateRange: DateRange): void {
    this.isAdding = true;
    combineLatest([
      this.store.user$.pipe(filter(isNonNull)),
      this.timelineData$.pipe(filter(isNonNull)),
      of(dateRange),
    ])
      .pipe(
        take(1),
        switchMap(([user, timelineData, { start, end }]) =>
          this.bookingService.createBooking({
            from: start.getTime(),
            to: end.getTime(),
            by: user.id,
            pump: this.getBestPump(start.getTime(), end.getTime(), timelineData)
              .id,
          })
        ),
        switchMapTo(this.refreshTimelineData()),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        error: (error) => this.errorService.showErrorInDialog(error),
      });
  }

  private refreshTimelineData(): Observable<void> {
    return this.updateTimeLine(this.dateRange.value);
  }

  private getBestPump(
    start: number,
    end: number,
    timelineData: TimelineData
  ): Pump {
    return (
      timelineData.pumps.find(
        (pump) =>
          !pump.bookings.some(({ from, to }) => end > from && start < to)
      ) ?? throwExpression(new Error('No free slots'))
    );
  }
}
