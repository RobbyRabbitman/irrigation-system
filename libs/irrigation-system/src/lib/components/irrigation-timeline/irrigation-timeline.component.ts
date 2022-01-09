import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { Booking, Pump, User } from '@irrigation/generated/client';
import { isNonNull, throwIfNullish } from '@irrigation/shared/util';
import {
  ChartType,
  Row,
  Column,
  ChartSelectionChangedEvent,
} from 'angular-google-charts';

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

  @Output()
  selected = new EventEmitter<Booking>();

  _bookings!: Map<number, Booking>;

  @Input()
  set data({ pumps, from, to }: TimelineData) {
    if (isNonNull(pumps)) {
      let index = 0;
      this._options = {
        hAxis: {
          format: 'HH:mm',
          minValue: from,
          maxValue: to,
        },
        tooltip: { isHtml: true },
      };
      this._bookings = new Map();
      this._data = pumps.reduce((rows, pump) => {
        index += 2;
        rows.push(
          ...pump.bookings.reduce((rows, booking) => {
            this._bookings.set(index++, booking);
            rows.push([
              pump.name,
              this.getUsername(booking.by),
              null,
              this._createTooltip(booking),
              new Date(booking.from),
              new Date(booking.to),
            ]);
            return rows;
          }, new Array<Row>([pump.name, '', 'opacity:0;', '', from, from], [pump.name, '', 'opacity:0;', '', to, to]))
        );
        return rows;
      }, new Array<Row>());
    }
  }

  public _onSelect(event: ChartSelectionChangedEvent): void {
    console.log(this._bookings.get(throwIfNullish(event.selection[0].row)));
  }

  private getUsername(user: User): string {
    return user?.username ?? 'unknown';
  }

  private _createTooltip(booking: Booking) {
    return `<div style="padding:5px 5px 5px 5px;font-size: 1rem;">
            <h3><strong>${this.getUsername(booking.by)}</strong></h3>
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
