import { Component, Input } from '@angular/core';
import { IrrigationSystem } from '@irrigation/generated/client';

@Component({
  selector: 'irrigation-irrigation-system-card',
  templateUrl: './irrigation-system-card.component.html',
  styleUrls: ['./irrigation-system-card.component.scss'],
})
export class IrrigationSystemCardComponent {
  public readonly ACTIONS_SLOT = '[slot=action]';
  @Input()
  public irrigationSystem?: IrrigationSystem;
}
