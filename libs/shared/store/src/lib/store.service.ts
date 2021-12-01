import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import {
  AuthService,
  Login,
  User,
  UserService,
} from '@irrigation/generated/client';

@Injectable()
export class StoreService {
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  public readonly user$ = this._user$.asObservable().pipe(shareReplay(1));
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService
  ) {}

  public dispatchLogin(login: Login): Observable<void> {
    return this.auth.login(login).pipe(map((user) => this._user$.next(user)));
  }
}
