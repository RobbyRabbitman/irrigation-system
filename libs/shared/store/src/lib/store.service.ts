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
  CreatePumpDTO,
  CreateUserDTO,
  IrrigationSystem,
  IrrigationSystemService,
  Login,
  PumpService,
  UpdateUserDTO,
  User,
  UserService,
} from '@irrigation/generated/client';
import { isNonNull, isNullish, throwIfNullish } from '@irrigation/shared/util';
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
  private readonly _irrigationSystems$ = new BehaviorSubject<
    IrrigationSystem[] | undefined
  >(undefined);
  public readonly irrigationSystems$ = this._irrigationSystems$
    .asObservable()
    .pipe(shareReplay(1));
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly irrigationSystemService: IrrigationSystemService,
    private readonly pumpService: PumpService,
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

  public dispatchGetAllIrrigationSystems(): Observable<void> {
    return this.irrigationSystemService
      .getAll()
      .pipe(
        map((irrigationSystems) =>
          this._irrigationSystems$.next(irrigationSystems)
        )
      );
  }

  public dispatchUpdateUser(id: string, dto: UpdateUserDTO): Observable<void> {
    return this.userService
      .update(dto, id)
      .pipe(map((user) => this.updateUserState(user)));
  }

  public dispatchDeletePumpFromIrrigationSystem(
    irrigationSystem: string,
    pump: string
  ): Observable<void> {
    return this.irrigationSystemService
      .deletePump(irrigationSystem, pump)
      .pipe(
        map((irrigationSystems) =>
          this.updateIrrigationState(irrigationSystems)
        )
      );
  }

  public dispatchAddNewPumpToIrrigationSystem(
    irrigationSystem: string,
    pump: CreatePumpDTO
  ): Observable<void> {
    return this.pumpService.create(pump).pipe(
      switchMap(({ id }) =>
        this.irrigationSystemService.addPump(irrigationSystem, id)
      ),
      map((irrigationSystems) => this.updateIrrigationState(irrigationSystems))
    );
  }

  public dispatchAddIrrigationSystemToUser(
    user: string,
    irrigationSystem: string
  ): Observable<void> {
    return this.userService
      .addIrrigationSystem(user, irrigationSystem)
      .pipe(map((user) => this.updateUserState(user)));
  }

  public dispatchDeleteIrrigationSystemFromUser(
    user: string,
    irrigationSystem: string
  ): Observable<void> {
    return this.userService
      .deleteIrrigationSystem(user, irrigationSystem)
      .pipe(map((user) => this.updateUserState(user)));
  }

  private updateUserState(newUser: User): void {
    if (this._user$.value?.id === newUser.id) this._user$.next(newUser);
    const users = this._users$.value;
    if (isNonNull(users)) {
      const userIndex = users.findIndex((current) => current.id === newUser.id);
      if (userIndex >= 0) {
        users[userIndex] = newUser;
        this._users$.next([...users]);
      }
    }
  }

  private updateIrrigationState(newIrrigationSystem: IrrigationSystem): void {
    if (
      isNonNull(
        this._user$.value?.irrigationSystems?.find(
          (x) => x.id === newIrrigationSystem.id
        )
      )
    )
      this.dispatchGetUser().subscribe();
    if (isNullish(this._irrigationSystems$.value))
      this._irrigationSystems$.next([newIrrigationSystem]);
    else {
      const irrigationSystems = this._irrigationSystems$.value;
      const index = irrigationSystems.findIndex(
        (x) => x.id === newIrrigationSystem.id
      );
      if (index >= 0) {
        irrigationSystems[index] = newIrrigationSystem;
        this._irrigationSystems$.next([...irrigationSystems]);
      }
    }
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
