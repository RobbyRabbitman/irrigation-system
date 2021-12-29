import {
  IrrigationSystem,
  OBJECT_ID,
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
@ApiTags('irrigation-system')
@Controller('irrigation-system')
export class IrrigationSystemController {
  public constructor(
    private readonly irrigationSystem: IrrigationSystemService
  ) {}

  @ApiOkResponse({ type: IrrigationSystem, isArray: true })
  @Get(`:${OBJECT_ID}`)
  public getIrrigationSystem(
    @Request() req: PassportRequest,
    @Param(OBJECT_ID) id: string
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
  @Post(`:${OBJECT_ID}`)
  public addPumps(
    @Param(OBJECT_ID) id: string,
    @Body() dto: UpdateIrrigationSystemDTO
  ) {
    return this.irrigationSystem.updateOne(id, dto);
  }
}
