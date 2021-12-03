import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IrrigationSystem } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import { combineLatest, filter, map, Observable, pluck } from 'rxjs';
import { isNonNull, isNullish } from '@irrigation/shared/util';
import { ROUTE_IRRIGATION_SYSTEM_OVERVIEW } from '../../routes/routes';

@Component({
  selector: 'irrigation-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.scss'],
})
export class IrrigationSystemComponent implements OnInit {
  public static readonly QUERY_PARAM_ID = 'id';

  public irrigationSystem$!: Observable<IrrigationSystem>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: StoreService,
    private readonly router: Router
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
  }
}
