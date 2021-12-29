import {
  CreatePumpDTO,
  OBJECT_ID,
  Pump,
  UpdatePumpDTO,
} from '@irrigation/shared/model';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { PumpService } from './pump.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiTags('pump')
@Controller('pump')
export class PumpController {
  public constructor(private readonly pumpService: PumpService) {}

  @ApiCreatedResponse({ type: Pump })
  @Post()
  public create(@Body() dto: CreatePumpDTO): Observable<Pump> {
    return this.pumpService.createOne(dto);
  }

  @ApiOkResponse({ type: Pump })
  @Post(`:${OBJECT_ID}`)
  public update(
    @Param(OBJECT_ID) id: string,
    @Body() dto: UpdatePumpDTO
  ): Observable<Pump> {
    return this.pumpService.updateOne(id, dto);
  }
}
