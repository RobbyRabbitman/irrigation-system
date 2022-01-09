import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePumpDTO {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;
}

export class UpdatePumpDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
