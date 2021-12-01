import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateIrrigationSystemDTO {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  pumps?: string[];
}

export class UpdateIrrigationSystemDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  pumps?: string[];
}
