import { CreateUserDTO, UpdateUserDTO, User } from '@irrigation/shared/model';
import { isNonNull } from '@irrigation/shared/util';
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Param,
  Post,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
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
import { IrrigationSystemController } from '../irrigation-system/irrigation-system.controller';
import { PassportRequest } from '../model/Passport';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(UserController.RESOURCE)
@Controller(UserController.RESOURCE)
export class UserController {
  public static readonly RESOURCE = 'user';
  public constructor(private readonly user: UserService) {}

  @UseGuards(AdminGuard, AuthenticatedUserGuard)
  @ApiOkResponse({ type: User, isArray: true })
  @Get('all')
  public getAll(): Observable<User[]> {
    return this.user.findAll();
  }

  @ApiOkResponse({ type: User })
  @Get(`:${UserController.RESOURCE}`)
  public getById(
    @Req() req: PassportRequest,
    @Param(UserController.RESOURCE) id: string
  ): Observable<User> {
    if (!req.user.admin && req.user.id !== id) throw new ForbiddenException();
    return this.user.findOneById(id);
  }

  @ApiOkResponse({ type: User })
  @Get()
  public get(@Req() req: PassportRequest): Observable<User> {
    return this.user.findOneById(req.user.id);
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  public create(
    @Req() req: PassportRequest,
    @Body() dto: CreateUserDTO
  ): Observable<User> {
    if (!req.user.admin && dto.authenticated === true)
      throw new ForbiddenException();
    return this.user.create(dto);
  }

  @ApiOkResponse({ type: User })
  @Post(`:${UserController.RESOURCE}`)
  public update(
    @Req() req: PassportRequest,
    @Body() dto: UpdateUserDTO,
    @Param(UserController.RESOURCE) id: string
  ): Observable<User> {
    if (
      (!req.user.admin && req.user.id !== id) ||
      (!req.user.admin && isNonNull(dto.admin)) ||
      (!req.user.admin && isNonNull(dto.authenticated))
    )
      throw new ForbiddenException();
    return this.user.update(id, dto);
  }

  @UseGuards(AdminGuard, AuthenticatedUserGuard)
  @ApiOkResponse({ type: User })
  @Post(
    `:${UserController.RESOURCE}/irrigationSystems/:${IrrigationSystemController.RESOURCE}`
  )
  public addIrrigationSystem(
    @Param(UserController.RESOURCE) user: string,
    @Param(IrrigationSystemController.RESOURCE) irrigationSystem: string
  ): Observable<User> {
    return this.user.updateIrrigationSystems(
      user,
      irrigationSystem,
      '$addToSet'
    );
  }

  @UseGuards(AdminGuard, AuthenticatedUserGuard)
  @ApiOkResponse({ type: User })
  @Delete(
    `:${UserController.RESOURCE}/irrigationSystems/:${IrrigationSystemController.RESOURCE}`
  )
  public deleteIrrigationSystem(
    @Param(UserController.RESOURCE) user: string,
    @Param(IrrigationSystemController.RESOURCE) irrigationSystem: string
  ): Observable<User> {
    return this.user.updateIrrigationSystems(user, irrigationSystem, '$pull');
  }
}
