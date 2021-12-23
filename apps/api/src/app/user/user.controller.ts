import {
  CreateUserDTO,
  OBJECT_ID,
  UpdateUserDTO,
  User,
} from '@irrigation/shared/model';
import { isNonNull } from '@irrigation/shared/util';
import {
  Controller,
  Get,
  UseGuards,
  Put,
  Req,
  Body,
  Param,
  Post,
  ForbiddenException,
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
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  public constructor(private readonly user: UserService) {}

  @ApiOkResponse({ type: User })
  @Get(`:${OBJECT_ID}`)
  public getById(
    @Req() req: PassportRequest,
    @Param(OBJECT_ID) id: string
  ): Observable<User> {
    if (!req.user.admin && req.user.id !== id) throw new ForbiddenException();
    return this.user.findOneById(id);
  }

  @ApiOkResponse({ type: User })
  @Get()
  public get(@Req() req: PassportRequest): Observable<User> {
    return this.user.findOneById(req.user.id);
  }

  @ApiOkResponse({ type: User, isArray: true })
  @Get('all')
  public getAll(@Req() req: PassportRequest): Observable<User[]> {
    if (!req.user.admin) throw new ForbiddenException();
    return this.user.findAll();
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
  @Put(`:${OBJECT_ID}`)
  public update(
    @Req() req: PassportRequest,
    @Body() dto: UpdateUserDTO,
    @Param(OBJECT_ID) id: string
  ): Observable<User> {
    if (
      (!req.user.admin && req.user.id !== id) ||
      (!req.user.admin && isNonNull(dto.admin)) ||
      (!req.user.admin && isNonNull(dto.irrigationSystems)) ||
      (!req.user.admin && isNonNull(dto.authenticated))
    )
      throw new ForbiddenException();
    return this.user.update(id, dto);
  }
}
