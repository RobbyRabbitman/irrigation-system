import { IrrigationSystem } from '@irrigation/shared/model';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AuthenticatedUserGuard } from '../guards/authenticated-user.guard';
import { PassportRequest } from '../model/Passport';
import { PumpController } from '../pump/pump.controller';
import { IrrigationSystemService } from './irrigation-system.service';

@UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
@ApiBearerAuth()
@ApiTags(IrrigationSystemController.RESOURCE)
@Controller(IrrigationSystemController.RESOURCE)
export class IrrigationSystemController {
  public static readonly RESOURCE = 'irrigationSystem';
  public constructor(
    private readonly irrigationSystem: IrrigationSystemService
  ) {}

  @UseGuards(AdminGuard)
  @ApiOkResponse({ type: IrrigationSystem, isArray: true })
  @Get(`all`)
  public getAll(): Observable<IrrigationSystem[]> {
    return this.irrigationSystem.findAll();
  }

  @ApiOkResponse({ type: IrrigationSystem, isArray: true })
  @Get(`:${IrrigationSystemController.RESOURCE}`)
  public getIrrigationSystem(
    @Request() req: PassportRequest,
    @Param(IrrigationSystemController.RESOURCE) id: string
  ) {
    if (
      !req.user.admin &&
      !req.user.irrigationSystems.map(({ id }) => id).includes(id)
    )
      throw new ForbiddenException();
    return this.irrigationSystem.findOne(id);
  }

  @UseGuards(AdminGuard)
  @ApiOkResponse({ type: IrrigationSystem })
  @Post(
    `:${IrrigationSystemController.RESOURCE}/pumps/:${PumpController.RESOURCE}`
  )
  public addPump(
    @Param(IrrigationSystemController.RESOURCE) irrigationSystem: string,
    @Param(PumpController.RESOURCE) pump: string
  ) {
    return this.irrigationSystem.updatePumps(
      irrigationSystem,
      pump,
      '$addToSet'
    );
  }

  @UseGuards(AdminGuard)
  @ApiOkResponse({ type: IrrigationSystem })
  @Delete(
    `:${IrrigationSystemController.RESOURCE}/pumps/:${PumpController.RESOURCE}`
  )
  public deletePump(
    @Param(IrrigationSystemController.RESOURCE) irrigationSystem: string,
    @Param(PumpController.RESOURCE) pump: string
  ) {
    return this.irrigationSystem.updatePumps(irrigationSystem, pump, '$pull');
  }
}
