import { CreatePumpDTO, Pump } from '@irrigation/shared/model';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PassportRequest } from '../model/Passport';
import { PumpService } from './pump.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('pump')
@Controller('pump')
export class PumpController {
  public constructor(private readonly pump: PumpService) {}

  @ApiCreatedResponse({ type: Pump })
  @Post()
  public create(
    @Req() req: PassportRequest,
    @Body() dto: CreatePumpDTO
  ): Observable<Pump> {
    if (!req.user.admin)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.pump.create(dto);
  }
}
