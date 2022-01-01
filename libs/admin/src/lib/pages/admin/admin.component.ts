import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CreatePumpDTO,
  IrrigationSystem,
  Pump,
  UpdateUserDTO,
  User,
} from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import { isNonNull } from '@irrigation/shared/util';
import { combineLatest, filter, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'irrigation-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {
  public searchControl = new FormControl();
  public readonly searchControlDefaulValue = '';
  public _users$!: Observable<User[]>;

  constructor(public readonly store: StoreService) {}

  ngOnInit(): void {
    this._users$ = combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControlDefaulValue), // trigger combineLatest, cuz it needs at least every observable to emit once
        map(String),
        map((input) => input.toLocaleLowerCase())
      ),
      this.store.users$.pipe(filter(isNonNull)),
    ]).pipe(
      map(([input, users]) =>
        users.filter((user) =>
          user.username.toLocaleLowerCase().includes(input)
        )
      )
    );
    this.store.dispatchGetAllUsers().subscribe();
    this.store.dispatchGetAllIrrigationSystems().subscribe();
  }

  public _onEdit(id: string, dto: UpdateUserDTO): void {
    this.store.dispatchUpdateUser(id, dto).subscribe();
  }

  public _onDeletePump(irrigationSystem: IrrigationSystem, pump: Pump): void {
    this.store
      .dispatchDeletePumpFromIrrigationSystem(irrigationSystem.id, pump.id)
      .subscribe();
  }
  public _onAddPump(
    irrigationSystem: IrrigationSystem,
    pump: CreatePumpDTO
  ): void {
    this.store
      .dispatchAddNewPumpToIrrigationSystem(irrigationSystem.id, pump)
      .subscribe();
  }
}
