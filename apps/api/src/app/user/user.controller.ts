import {
  CreateUserDTO,
  OBJECT_ID,
  UpdateUserDTO,
  User,
} from '@irrigation/shared/model';
import {
  Controller,
  Get,
  UseGuards,
  Put,
  Req,
  Body,
  Param,
  Post,
  HttpException,
  HttpStatus,
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
    if (!req.user.admin && req.user.id !== id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.user.findOneById(id);
  }

  @ApiOkResponse({ type: User })
  @Get()
  public get(@Req() req: PassportRequest): Observable<User> {
    return this.user.findOneById(req.user.id);
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  public create(@Body() dto: CreateUserDTO): Observable<User> {
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
      (!req.user.admin && dto.admin != null) ||
      (!req.user.admin && dto.irrigationSystems != null)
    )
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.user.update(id, dto);
  }
}
