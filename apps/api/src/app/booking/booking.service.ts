import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from as rxjsFrom, mapTo, Observable } from 'rxjs';
import { CreateBookingDTO } from '../model/api/booking/booking.dto';
import { Booking, BookingDocument } from '../model/api/booking/booking.model';

@Injectable()
export class BookingService {
  public constructor(
    @InjectModel(Booking.name) private readonly model: Model<BookingDocument>
  ) {}

  public findOneById(id: string): Observable<Booking> {
    return rxjsFrom(this.model.findById(id));
  }

  public create(dto: CreateBookingDTO): Observable<Booking> {
    return rxjsFrom(
      this.model.create({
        ...dto,
        by: new Types.ObjectId(dto.by),
        pump: new Types.ObjectId(dto.pump),
      })
    );
  }

  public deleteById(id: string): Observable<void> {
    return rxjsFrom(this.model.deleteOne({ _id: id }).exec()).pipe(
      mapTo(undefined)
    );
  }

  public inPeriod(
    pump: string,
    from: number,
    to: number
  ): Observable<Booking[]> {
    return rxjsFrom(
      this.model.find({
        from: { $lte: to },
        to: { $gte: from },
        pump: new Types.ObjectId(pump) as unknown,
      })
    ) as Observable<Booking[]>;
  }
}
