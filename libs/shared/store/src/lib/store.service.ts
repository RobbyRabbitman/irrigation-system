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
  UpdateUserDTO,
  User,
  UserService,
} from '@irrigation/generated/client';
import { isNonNull, throwIfNullish } from '@irrigation/shared/util';
import { LocalStorageService } from './local-storage.service';
@Injectable()
export class StoreService {
  private readonly LOCAL_STORAGE_JWT = 'jwt';
  private readonly _user$ = new BehaviorSubject<User | null | undefined>(
    undefined
  );
  public readonly user$ = this._user$.asObservable().pipe(shareReplay(1));
  private readonly _users$ = new BehaviorSubject<User[] | undefined>(undefined);
  public readonly users$ = this._users$.asObservable().pipe(shareReplay(1));
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

  public dispatchGetAllUsers(): Observable<void> {
    return this.userService
      .getAll()
      .pipe(map((users) => this._users$.next(users)));
  }

  public dispatchLogin(login: Login): Observable<void> {
    return this.authService
      .login(login)
      .pipe(map((user) => this._user$.next(user)));
  }

  public dispatchUpdateUser(id: string, dto: UpdateUserDTO): Observable<void> {
    return this.userService.update(dto, id).pipe(
      map((user) => {
        if (this._user$.value?.id === user.id) this._user$.next(user);
        const users = this._users$.value;
        if (isNonNull(users)) {
          const userIndex = users.findIndex(
            (current) => current.id === user.id
          );
          if (userIndex >= 0) {
            users[userIndex] = user;
            this._users$.next([...users]);
          }
        }
      })
    );
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
