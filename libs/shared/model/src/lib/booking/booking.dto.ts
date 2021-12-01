import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateBookingDTO {
  @IsPositive()
  @ApiProperty({ required: true })
  from!: number;
  @IsPositive()
  @ApiProperty({ required: true })
  to!: number;
  @IsString()
  @ApiProperty({ required: true })
  by!: string;
  @IsString()
  @ApiProperty({ required: true })
  pump!: string;
}

export class UpdateBookingDTO {
  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false })
  from?: number;
  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false })
  to?: number;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  by?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  pump?: string;
}
