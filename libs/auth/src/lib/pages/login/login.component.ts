import { Component, Inject, InjectionToken, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';
import { isNonNull } from '@irrigation/shared/util';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  switchMapTo,
  take,
} from 'rxjs';

export type LoginSuccessFulCallback = (user: User) => void;

export const LOGIN_SUCCESSFUL_CALLBACK_TOKEN = new InjectionToken<
  BehaviorSubject<LoginSuccessFulCallback | undefined>
>('', {
  providedIn: 'root',
  factory: () =>
    new BehaviorSubject<LoginSuccessFulCallback | undefined>(undefined),
});

@Component({
  selector: 'irrigation-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly control_username = new FormControl();
  public readonly control_password = new FormControl();
  public readonly form = new FormGroup({
    1: this.control_username,
    2: this.control_password,
  });

  public constructor(
    private readonly store: StoreService,
    private readonly router: Router,
    @Inject(LOGIN_SUCCESSFUL_CALLBACK_TOKEN)
    private readonly loginsuccessfulCallBack$: BehaviorSubject<
      LoginSuccessFulCallback | undefined
    >
  ) {}

  public _onSubmit(): void {
    if (this.form.valid)
      this.store
        .dispatchLogin({
          username: this.control_username.value,
          password: this.control_password.value,
        })
        .pipe(
          switchMapTo(
            combineLatest([
              this.store.user$.pipe(filter(isNonNull)),
              this.loginsuccessfulCallBack$,
            ])
          ),
          take(1)
        )
        .subscribe({
          next: ([user, loginsuccessfulCallBack]) =>
            loginsuccessfulCallBack?.(user) ?? this.router.navigateByUrl(''),
        });
  }
}
