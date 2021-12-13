import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
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
    { type: 'string', role: 'tooltip' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
  ];
  public _options?: object;

  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  @Input()
  set data({ pumps, from, to }: TimelineData) {
    if (isNonNull(pumps)) {
      this._options = {
        hAxis: {
          format: 'HH:mm',
          minValue: from,
          maxValue: to,
        },
        tooltip: { isHtml: true },
      };
      this._data = pumps.reduce(
        (rows, pump) => [
          ...rows,
          ...pump.bookings.reduce(
            (rows, booking) => [
              ...rows,
              [
                pump.name,
                booking.by.username,
                null,
                this._createTooltip(booking),
                new Date(booking.from),
                new Date(booking.to),
              ],
            ],
            new Array<any>(
              [pump.name, '', 'opacity:0;', '', from, from],
              [pump.name, '', 'opacity:0;', '', to, to]
            )
          ),
        ],
        new Array<any>()
      );
    }
  }

  private _createTooltip(booking: Booking) {
    return `<div style="padding:5px 5px 5px 5px;font-size: 1rem;">
            <h3><strong>${booking.by.username}</strong></h3>
            <p>
            ${formatDate(booking.from, 'HH:mm', this.locale)} - 
            ${formatDate(booking.to, 'HH:mm', this.locale)}
            </p>
            <p>
            Dauer: ${(booking.to - booking.from) / 1000 / 60 / 60}h
            </p>
            </div`;
  }
}
