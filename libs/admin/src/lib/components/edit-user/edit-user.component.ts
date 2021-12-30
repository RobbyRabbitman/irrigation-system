import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  IrrigationSystem,
  UpdateUserDTO,
  User,
} from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'irrigation-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private _user?: User;

  public readonly authenticated = new FormControl();
  public readonly irrigationSystemDefaultValue = '';
  public readonly irrigationSystem = new FormControl(
    this.irrigationSystemDefaultValue
  );
  private readonly _irrigationSystems$ = new BehaviorSubject<
    IrrigationSystem[]
  >([]);
  public irrigationSystems$ = combineLatest([
    this.irrigationSystem.valueChanges.pipe(
      startWith(this.irrigationSystemDefaultValue),
      map(String),
      map((input) => input.toLocaleLowerCase())
    ),
    this._irrigationSystems$,
  ]).pipe(
    map(([input, irrigationSystems]) =>
      irrigationSystems.filter(
        ({ name, id }) =>
          name.toLocaleLowerCase().includes(input) ||
          id.toLocaleLowerCase().includes(input)
      )
    ),
    shareReplay(1)
  );

  get user(): User | undefined {
    return this._user;
  }

  @Input()
  public set user(value: User | undefined) {
    this._user = value;
    this.authenticated.setValue(value?.authenticated);
  }

  @Input()
  public set irrigationSystems(value: IrrigationSystem[] | null | undefined) {
    this._irrigationSystems$.next(value ?? []);
  }

  @Output()
  public readonly edit = new EventEmitter<UpdateUserDTO>();

  constructor(public readonly store: StoreService) {}

  public ngOnInit(): void {
    this.authenticated.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authenticated) => this.edit.emit({ authenticated }),
    });
  }

  public _onLogout(): void {
    this.edit.emit({ jwt: '' });
  }

  public _onAddIrrigationSystem(user: User): void {
    if (this.irrigationSystem.valid)
      this.store
        .dispatchAddIrrigationSystemToUser(user.id, this.irrigationSystem.value)
        .subscribe();
  }

  public _onDeleteIrrigationSystem(
    user: User,
    irrigationSystem: IrrigationSystem
  ): void {
    this.store
      .dispatchDeleteIrrigationSystemFromUser(user.id, irrigationSystem.id)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
