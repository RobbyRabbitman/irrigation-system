import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document, Types } from 'mongoose';
import { Identifyable } from '../identifyable.model';
import {
  IrrigationSystem,
  IrrigationSystemName,
} from '../irrigation-system/irrigation-system.model';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User extends Identifyable {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Prop({ unique: true, required: true, index: true })
  username!: string;
  @Prop({ required: true })
  password!: string;
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Prop({
    type: [{ type: Types.ObjectId, ref: IrrigationSystemName }],
  })
  irrigationSystems?: IrrigationSystem[];
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Prop()
  admin?: boolean;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Prop()
  jwt?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserName = 'User';

export type UserDocument = User & Document;
