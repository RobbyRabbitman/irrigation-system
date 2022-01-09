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
import { AuthenticatedUserGuard } from '../guards/authenticated-user.guard';
import { CreatePumpDTO, UpdatePumpDTO } from '../model/api/pump/pump.dto';
import { Pump } from '../model/api/pump/pump.model';
import { PumpService } from './pump.service';

@UseGuards(JwtAuthGuard, AdminGuard, AuthenticatedUserGuard)
@ApiBearerAuth()
@ApiTags(PumpController.RESOURCE)
@Controller(PumpController.RESOURCE)
export class PumpController {
  public static readonly RESOURCE = 'pump';
  public constructor(private readonly pumpService: PumpService) {}

  @ApiCreatedResponse({ type: Pump })
  @Post()
  public create(@Body() dto: CreatePumpDTO): Observable<Pump> {
    return this.pumpService.createOne(dto);
  }

  @ApiOkResponse({ type: Pump })
  @Post(`:${PumpController.RESOURCE}`)
  public update(
    @Param(PumpController.RESOURCE) id: string,
    @Body() dto: UpdatePumpDTO
  ): Observable<Pump> {
    return this.pumpService.updateOne(id, dto);
  }
}
