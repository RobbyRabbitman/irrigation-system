import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { isNonNull } from '@irrigation/shared/util';
import { PasswordService } from './password.service';
import { Jwt } from '../model/api/auth.model';
import { User } from '../model/api/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}

  public validate(
    username: string,
    password: string
  ): Observable<User | undefined> {
    return this.usersService.getOne(username).pipe(
      switchMap((user) =>
        this.passwordService
          .compare(password, user.password)
          .then((match) => (match ? user : undefined))
      ),
      map((user) => {
        if (isNonNull(user)) delete user.password;
        return user;
      })
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
