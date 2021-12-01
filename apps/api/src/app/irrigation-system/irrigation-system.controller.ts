import {
  Identifyable,
  IrrigationSystem,
  OBJECT_ID,
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

  @ApiOkResponse({ type: IrrigationSystem })
  @Put(`:${OBJECT_ID}/pumps`)
  public addPumps(
    @Request() req: PassportRequest,
    @Param(OBJECT_ID) id: string,
    @Body() dto: Identifyable[]
  ) {
    if (!req.user)
      //TODO
      throw new UnauthorizedException();
    return this.irrigationSystem.addPumps(id, dto);
  }
}
