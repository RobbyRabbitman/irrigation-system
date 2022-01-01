import { SchemaOptions } from '@nestjs/mongoose';
import { ToObjectOptions } from 'mongoose';

export const TRANSFORM_OMIT__ID = (
  doc: unknown,
  ret: { _id: unknown },
  options: unknown
) => {
  delete ret._id;
  return ret;
};

const TO_OBJECT_OPTIONS: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  transform: TRANSFORM_OMIT__ID,
};

export const SCHEMA_OPTIONS: SchemaOptions = {
  toJSON: TO_OBJECT_OPTIONS,
  toObject: TO_OBJECT_OPTIONS,
};
