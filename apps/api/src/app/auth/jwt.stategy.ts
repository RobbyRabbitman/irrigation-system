import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@irrigation/shared/model';
import { Payload } from './Payload';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';

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
    return firstValueFrom(this.user.getOne(payload.username));
  }
}
