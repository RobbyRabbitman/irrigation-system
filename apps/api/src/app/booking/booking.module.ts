import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingName, BookingSchema } from '../model/api/booking/booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookingName, schema: BookingSchema }]),
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [MongooseModule],
})
export class BookingModule {}
