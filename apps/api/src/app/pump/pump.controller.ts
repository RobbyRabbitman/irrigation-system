import {
  CreatePumpDTO,
  OBJECT_ID,
  Pump,
  UpdatePumpDTO,
} from '@irrigation/shared/model';
import {
  Body,
  Controller,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
    if (!req.user.admin) throw new ForbiddenException();
    return this.pump.create(dto);
  }

  @ApiOkResponse({ type: Pump })
  @Post(`${OBJECT_ID}`)
  public update(
    @Req() req: PassportRequest,
    @Param(OBJECT_ID) id: string,
    @Body() dto: UpdatePumpDTO
  ): Observable<Pump> {
    if (!req.user.admin) throw new ForbiddenException();
    return this.pump.updateOne(id, dto);
  }
}
