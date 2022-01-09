import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Identifyable } from '../identifyable.model';
import { SCHEMA_OPTIONS } from '../schema.options';

@Schema(SCHEMA_OPTIONS)
export class Pump extends Identifyable {
  @ApiProperty({ required: true })
  @Prop()
  name!: string;
}

export const PumpSchema = SchemaFactory.createForClass(Pump);

export const PumpName = 'Pump';

export type PumpDocument = Pump & Document;
