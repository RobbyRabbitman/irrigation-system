import { Component, Input } from '@angular/core';
import { Booking, Pump } from '@irrigation/generated/client';
import { isNonNull } from '@irrigation/shared/util';
import { ChartType, Row, Column } from 'angular-google-charts';

export type PumpWithBookings = Pump & { bookings: Booking[] };
export interface TimelineData {
  pumps: PumpWithBookings[];
  from: Date;
  to: Date;
}

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
    { type: 'string', id: 'label' },
    { type: 'string', role: 'style' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
  ];
  public _options?: object;

  @Input()
  set data({ pumps, from, to }: TimelineData) {
    if (isNonNull(pumps)) {
      this._options = {
        hAxis: {
          format: 'HH:mm',
          minValue: from,
          maxValue: to,
        },
      };
      this._data = pumps.reduce(
        (rows, pump) => [
          ...rows,
          ...pump.bookings.reduce(
            (rows, booking) => [
              ...rows,
              [
                pump.name,
                '',
                null,
                new Date(booking.from),
                new Date(booking.to),
              ],
            ],
            new Array<any>(
              [pump.name, '', 'opacity:0;', from, from],
              [pump.name, '', 'opacity:0;', to, to]
            )
          ),
        ],
        new Array<any>()
      );
    }
  }
}
