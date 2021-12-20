import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

import { StoreService } from '@irrigation/shared/store';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import {
  LoginSuccessFulCallback,
  LOGIN_SUCCESSFUL_CALLBACK_TOKEN,
} from '../pages/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanLoad, CanActivateChild, CanActivate {
  public constructor(
    private readonly store: StoreService,
    private readonly router: Router,
    @Inject(LOGIN_SUCCESSFUL_CALLBACK_TOKEN)
    private readonly loginsuccessfulCallBack$: BehaviorSubject<
      LoginSuccessFulCallback | undefined
    >
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.handle(route.url);
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.handle(childRoute.url);
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.handle(segments);
  }

  private handle(segments: UrlSegment[]): Observable<boolean> {
    const queryParams =
      this.router.getCurrentNavigation()?.extractedUrl.queryParams;

    return this.store.user$.pipe(
      filter((user) => user !== undefined),
      map(Boolean),
      tap((user) => {
        if (!user) {
          this.loginsuccessfulCallBack$.next(() =>
            this.router.navigate([segments.join('/')], { queryParams })
          );
          this.router.navigateByUrl('auth/login');
        }
      })
    );
  }
}
