import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserName, User } from '../user/user.model';
import { Identifyable } from '../identifyable.model';
import { Pump, PumpName } from '../pump/pump.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Booking extends Identifyable {
  @ApiProperty({ required: true })
  @Prop()
  from!: number;
  @ApiProperty({ required: true })
  @Prop()
  to!: number;
  @ApiProperty({ required: true })
  @Prop({ type: Types.ObjectId, ref: UserName })
  by!: User;
  @ApiProperty({ required: true })
  @Prop({ type: Types.ObjectId, ref: PumpName })
  pump!: Pump;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

export const BookingName = 'Booking';

export type BookingDocument = Booking & Document;
