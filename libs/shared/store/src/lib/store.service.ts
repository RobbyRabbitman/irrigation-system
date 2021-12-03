import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, shareReplay } from 'rxjs';
import {
  AuthService,
  Configuration,
  Login,
  User,
} from '@irrigation/generated/client';
import { isNonNull } from '@irrigation/shared/util';
@Injectable()
export class StoreService {
  private readonly _user$ = new BehaviorSubject<User | null | undefined>(
    undefined
  );
  public readonly user$ = this._user$.asObservable().pipe(shareReplay(1));
  constructor(
    private readonly auth: AuthService,
    public readonly config: Configuration
  ) {
    this.user$.pipe(filter(isNonNull)).subscribe({
      next: ({ jwt }) => (this.config.accessToken = jwt),
    });
  }

  public dispatchLogin(login: Login): Observable<void> {
    return this.auth.login(login).pipe(map((user) => this._user$.next(user)));
  }
}
