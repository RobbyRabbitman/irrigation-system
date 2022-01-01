import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IrrigationSystem } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import { isNonNull } from '@irrigation/shared/util';
import { filter, take } from 'rxjs';
import { ROUTE_IRRIGATION_SYSTEM } from '../../routes/routes';
import { IrrigationSystemComponent } from '../irrigation-system/irrigation-system.component';

@Component({
  selector: 'irrigation-irrigation-system-overview',
  templateUrl: './irrigation-system-overview.component.html',
  styleUrls: ['./irrigation-system-overview.component.scss'],
})
export class IrrigationSystemOverviewComponent implements OnInit {
  public constructor(
    public readonly store: StoreService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.store.user$.pipe(filter(isNonNull), take(1)).subscribe({
      next: ({ irrigationSystems }) =>
        irrigationSystems?.length === 1
          ? this.details(irrigationSystems[0])
          : undefined,
    });
  }

  public details({ id }: IrrigationSystem) {
    this.router.navigate([`../${ROUTE_IRRIGATION_SYSTEM}`], {
      relativeTo: this.route,
      queryParams: { [IrrigationSystemComponent.QUERY_PARAM_ID]: id },
    });
  }
}
