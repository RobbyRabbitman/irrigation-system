import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Identifyable } from '../identifyable.model';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Pump extends Identifyable {
  @ApiProperty({ required: true })
  @Prop()
  name!: string;
}

export const PumpSchema = SchemaFactory.createForClass(Pump);

export const PumpName = 'Pump';

export type PumpDocument = Pump & Document;
