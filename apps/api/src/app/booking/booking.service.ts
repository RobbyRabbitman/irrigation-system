import {
  Booking,
  BookingDocument,
  CreateBookingDTO,
} from '@irrigation/shared/model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from as rxjsFrom, Observable } from 'rxjs';

@Injectable()
export class BookingService {
  public constructor(
    @InjectModel(Booking.name) private readonly model: Model<BookingDocument>
  ) {}

  public create(dto: CreateBookingDTO): Observable<Booking> {
    return rxjsFrom(
      this.model.create({
        ...dto,
        by: new Types.ObjectId(dto.by),
        pump: new Types.ObjectId(dto.pump),
      })
    );
  }

  public inPeriod(
    pump: string,
    from: number,
    to: number
  ): Observable<Booking[]> {
    return rxjsFrom(
      this.model
        .find({
          from: { $lte: to },
          to: { $gte: from },
          pump: new Types.ObjectId(pump) as unknown,
        })
        .populate(['by', 'pump'])
    ) as Observable<Booking[]>;
  }
}
