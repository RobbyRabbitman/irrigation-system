import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { UpdateUserDTO, User } from '@irrigation/generated/client';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'irrigation-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private _user?: User;
  public readonly authenticated = new FormControl();
  get user(): User | undefined {
    return this._user;
  }

  @Input()
  public set user(value: User | undefined) {
    this._user = value;
    this.authenticated.setValue(value?.authenticated);
  }
  @Output()
  public readonly edit = new EventEmitter<UpdateUserDTO>();

  public ngOnInit(): void {
    this.authenticated.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (authenticated) => this.edit.emit({ authenticated }),
    });
  }

  public _onLogout(): void {
    this.edit.emit({ jwt: '' });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
