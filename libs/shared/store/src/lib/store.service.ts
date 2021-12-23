import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  mapTo,
  Observable,
  of,
  shareReplay,
  switchMap,
  switchMapTo,
} from 'rxjs';
import {
  AuthService,
  Configuration,
  CreateUserDTO,
  Login,
  User,
  UserService,
} from '@irrigation/generated/client';
import { throwIfNullish } from '@irrigation/shared/util';
import { LocalStorageService } from './local-storage.service';
@Injectable()
export class StoreService {
  private readonly LOCAL_STORAGE_JWT = 'jwt';
  private readonly _user$ = new BehaviorSubject<User | null | undefined>(
    undefined
  );
  public readonly user$ = this._user$.asObservable().pipe(shareReplay(1));
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly localstorage: LocalStorageService,
    public readonly config: Configuration
  ) {
    try {
      this.dispatchSetJwt(
        throwIfNullish(this.localstorage.get(this.LOCAL_STORAGE_JWT))
      )
        .pipe(switchMapTo(this.dispatchGetUser()))
        .subscribe();
    } catch (error) {
      this._user$.next(null);
    }
    this.user$
      .pipe(switchMap((user) => this.dispatchSetJwt(user?.jwt)))
      .subscribe();
  }

  public dispatchLogin(login: Login): Observable<void> {
    return this.authService
      .login(login)
      .pipe(map((user) => this._user$.next(user)));
  }

  public dispatchLogout(): Observable<void> {
    return of(this._user$.next(null));
  }

  public dispatchSignUp(dto: CreateUserDTO): Observable<void> {
    return this.authService
      .signUp(dto)
      .pipe(map((user) => this._user$.next(user)));
  }

  public dispatchSetJwt(jwt?: string): Observable<void> {
    return of(
      (this.config.accessToken = this.localstorage.set(
        this.LOCAL_STORAGE_JWT,
        jwt
      ))
    ).pipe(mapTo(undefined));
  }

  public dispatchGetUser(): Observable<void> {
    return this.userService.get().pipe(map((user) => this._user$.next(user)));
  }
}
