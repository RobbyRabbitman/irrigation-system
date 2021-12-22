import {
  IrrigationSystem,
  OBJECT_ID,
  UpdateIrrigationSystemDTO,
} from '@irrigation/shared/model';
import {
  Controller,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
  Request,
  Put,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
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
    if (!req.user)
      //TODO
      throw new UnauthorizedException();
    return this.irrigationSystem.findOne(id);
  }

  @ApiOkResponse({ type: IrrigationSystem, isArray: true })
  @Get(`all`)
  public getAll(
    @Request() req: PassportRequest
  ): Observable<IrrigationSystem[]> {
    if (!req.user.admin) throw new UnauthorizedException();
    return this.irrigationSystem.findAll();
  }

  @ApiOkResponse({ type: IrrigationSystem })
  @Put(`:${OBJECT_ID}`)
  public addPumps(
    @Request() req: PassportRequest,
    @Param(OBJECT_ID) id: string,
    @Body() dto: UpdateIrrigationSystemDTO
  ) {
    if (!req.user.admin) throw new UnauthorizedException();
    else return this.irrigationSystem.updateOne(id, dto);
  }
}
