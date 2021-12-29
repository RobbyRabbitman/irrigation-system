import {
  IrrigationSystem,
  UpdateIrrigationSystemDTO,
} from '@irrigation/shared/model';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { PassportRequest } from '../model/Passport';
import { IrrigationSystemService } from './irrigation-system.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(IrrigationSystemController.RESOURCE)
@Controller(IrrigationSystemController.RESOURCE)
export class IrrigationSystemController {
  public static readonly RESOURCE = 'irrigationSystem';
  public constructor(
    private readonly irrigationSystem: IrrigationSystemService
  ) {}

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
  @ApiOkResponse({ type: IrrigationSystem, isArray: true })
  @Get(`all`)
  public getAll(): Observable<IrrigationSystem[]> {
    return this.irrigationSystem.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiOkResponse({ type: IrrigationSystem })
  @Post(`:${IrrigationSystemController.RESOURCE}`)
  public addPumps(
    @Param(IrrigationSystemController.RESOURCE) id: string,
    @Body() dto: UpdateIrrigationSystemDTO
  ) {
    return this.irrigationSystem.updateOne(id, dto);
  }
}
