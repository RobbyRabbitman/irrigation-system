import { CreateUserDTO, Login, User } from '@irrigation/shared/model';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { from, Observable, switchMap } from 'rxjs';
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

  @ApiOkResponse({ type: User })
  @ApiBody({ type: Login })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() req: PassportRequest): Observable<User> {
    return this.authService
      .login(req.user)
      .pipe(
        switchMap(({ access_token }) =>
          this.userService.update(req.user.id, { jwt: access_token })
        )
      );
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
