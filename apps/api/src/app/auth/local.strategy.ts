import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { throwIfEmpty } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/api/user/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<User> {
    return firstValueFrom(
      this.authService
        .validate(username, password)
        .pipe(throwIfEmpty(() => new UnauthorizedException()))
    );
  }
}
