import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username!: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  @IsNotEmpty()
  authenticated!: boolean;
}

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  admin?: boolean;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  irrigationSystems?: string[];
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  jwt?: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  authenticated?: boolean;
}
