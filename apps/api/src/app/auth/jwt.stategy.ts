import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@irrigation/shared/model';
import { Payload } from './Payload';
import { UserService } from '../user/user.service';
import { firstValueFrom, map } from 'rxjs';
import { isNonNull } from '@irrigation/shared/util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(process.env.JWT_SECRET),
    });
  }

  async validate(payload: Payload): Promise<User> {
    return firstValueFrom(
      this.user.getOne(payload.username).pipe(
        map((user) => {
          if (isNonNull(user)) delete user.password;
          return user;
        })
      )
    );
  }
}
