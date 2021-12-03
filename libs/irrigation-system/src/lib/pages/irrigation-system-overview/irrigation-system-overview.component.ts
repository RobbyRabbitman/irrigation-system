import { Component } from '@angular/core';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-irrigation-system-overview',
  templateUrl: './irrigation-system-overview.component.html',
  styleUrls: ['./irrigation-system-overview.component.scss'],
})
export class IrrigationSystemOverviewComponent {
  constructor(public readonly store: StoreService) {}
}
