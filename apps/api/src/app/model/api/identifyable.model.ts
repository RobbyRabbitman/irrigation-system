import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const OBJECT_ID = 'id';

/**
 * Represents Mongo's _id. Every document has a default virtual getter _id -> id with id representing the ObjectId as a hex string.
 */
export class Identifyable {
  @ApiProperty({ required: true })
  @IsString()
  public [OBJECT_ID]: string;
}
