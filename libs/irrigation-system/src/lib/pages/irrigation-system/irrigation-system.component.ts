import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, IrrigationSystem } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  Observable,
  pluck,
  switchMap,
} from 'rxjs';
import { isNonNull, isNullish } from '@irrigation/shared/util';
import { ROUTE_IRRIGATION_SYSTEM_OVERVIEW } from '../../routes/routes';
import { PumpWithBookings } from '../../components/irrigation-timeline/irrigation-timeline.component';

@Component({
  selector: 'irrigation-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.scss'],
})
export class IrrigationSystemComponent implements OnInit {
  public static readonly QUERY_PARAM_ID = 'id';

  public irrigationSystem$!: Observable<IrrigationSystem>;
  public timelineData$!: Observable<PumpWithBookings[]>;

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
    this.timelineData$ = this.irrigationSystem$.pipe(
      map((irrigationSystem) => irrigationSystem.pumps),
      filter(isNonNull),
      switchMap((pumps) =>
        forkJoin(
          pumps.map((pump) =>
            this.bookingService
              .inPeriod(pump.id, 900, 1000)
              .pipe(map((bookings) => ({ ...pump, bookings })))
          )
        )
      )
    );
  }
}
