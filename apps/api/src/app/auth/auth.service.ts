import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/operators';
import { Jwt, User } from '@irrigation/shared/model';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  public validate(
    username: string,
    password: string
  ): Observable<User | undefined> {
    return this.usersService
      .getOne(username)
      .pipe(
        map((user) => (user && user.password === password ? user : undefined))
      );
  }

  public login(user: User): Observable<Jwt> {
    return of({
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    });
  }
}
