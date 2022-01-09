import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Jwt {
  @ApiProperty({ required: true })
  access_token!: string;
}

export class Login {
  @ApiProperty({ required: true })
  @IsString()
  username!: string;
  @ApiProperty({ required: true })
  @IsString()
  password!: string;
}
