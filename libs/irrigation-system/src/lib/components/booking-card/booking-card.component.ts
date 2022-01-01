import { Component, Input } from '@angular/core';
import { Booking } from '@irrigation/generated/client';

@Component({
  selector: 'irrigation-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  public readonly ACTIONS_SLOT = '[slot=action]';
  @Input()
  public booking?: Booking;
}
