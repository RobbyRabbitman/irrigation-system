import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { from, Observable, switchMap } from 'rxjs';
import { Jwt, Login } from '../model/api/auth.model';
import { CreateUserDTO } from '../model/api/user/user.dto';
import { User } from '../model/api/user/user.model';
import { PassportRequest } from '../model/Passport';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { PasswordService } from './password.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService
  ) {}

  @ApiOkResponse({ type: Jwt })
  @ApiBody({ type: Login })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() req: PassportRequest): Observable<Jwt> {
    return this.authService.login(req.user);
  }

  @ApiCreatedResponse({ type: User })
  @ApiBody({ type: CreateUserDTO })
  @Post('sign-up')
  public signUp(@Body() dto: CreateUserDTO): Observable<User> {
    return from(this.passwordService.hash(dto.password)).pipe(
      switchMap((hash) =>
        this.userService.create({
          ...dto,
          password: hash,
        })
      )
    );
  }
}
