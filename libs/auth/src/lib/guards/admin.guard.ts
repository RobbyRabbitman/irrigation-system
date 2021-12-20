import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { StoreService } from '@irrigation/shared/store';
import { filter, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  public constructor(
    private readonly store: StoreService,
    private readonly router: Router
  ) {}

  private handle(): Observable<boolean | UrlTree> {
    return this.store.user$.pipe(
      filter((user) => user !== undefined),
      map((user) => !!user?.admin),
      tap((isAdmin) => (isAdmin ? undefined : this.router.navigateByUrl('')))
    );
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.handle();
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.handle();
  }

  public canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> {
    return this.handle();
  }
}
