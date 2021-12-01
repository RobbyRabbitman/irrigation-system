import { Login, User } from '@irrigation/shared/model';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, switchMap } from 'rxjs';
import { PassportRequest } from '../model/Passport';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
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
}
