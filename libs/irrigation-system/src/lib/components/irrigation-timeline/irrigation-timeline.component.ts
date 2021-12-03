import { Component, Input } from '@angular/core';
import { Booking, Pump } from '@irrigation/generated/client';
import { isNonNull } from '@irrigation/shared/util';
import { ChartType, Row, Column } from 'angular-google-charts';

export type PumpWithBookings = Pump & { bookings: Booking[] };

@Component({
  selector: 'irrigation-irrigation-timeline',
  templateUrl: './irrigation-timeline.component.html',
  styleUrls: ['./irrigation-timeline.component.scss'],
})
export class IrrigationTimelineComponent {
  public _CHART_TYPE = ChartType.Timeline;
  public _data?: Row[];
  public _columns: Column[] = [
    { type: 'string', id: 'Name' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
  ];

  @Input()
  set data(value: PumpWithBookings[]) {
    if (isNonNull(value)) {
      this._data = value.reduce(
        (rows, pump) => [
          ...rows,
          ...pump.bookings.reduce(
            (rows, booking) => [
              ...rows,
              [pump.name, new Date(booking.from), new Date(booking.to)],
            ],
            new Array<Row>()
          ),
        ],
        new Array<Row>()
      );
    }
  }
}
