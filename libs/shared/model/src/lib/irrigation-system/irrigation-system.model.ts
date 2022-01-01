import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Identifyable } from '../identifyable.model';
import { PumpName, Pump } from '../pump/pump.model';
import { SCHEMA_OPTIONS } from '../schema.options';

@Schema(SCHEMA_OPTIONS)
export class IrrigationSystem extends Identifyable {
  @ApiProperty({ required: true })
  @Prop()
  name!: string;
  @ApiProperty({ required: false, isArray: true, type: Pump })
  @Prop({ type: [{ type: Types.ObjectId, ref: PumpName }] })
  pumps?: Pump[];
}

export const IrrigationSystemSchema =
  SchemaFactory.createForClass(IrrigationSystem);

export const IrrigationSystemName = 'IrrigationSystem';

export type IrrigationSystemDocument = IrrigationSystem & Document;
