import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UpdateUserDTO, User } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import { isNonNull } from '@irrigation/shared/util';
import { combineLatest, filter, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'irrigation-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public searchControl = new FormControl();
  public readonly searchControlDefaulValue = '';
  public _users$!: Observable<User[]>;

  constructor(private readonly store: StoreService) {}

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
  }

  public _onEdit(id: string, dto: UpdateUserDTO): void {
    this.store.dispatchUpdateUser(id, dto).subscribe();
  }
}
