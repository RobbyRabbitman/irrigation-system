import { Inject, Injectable } from "@angular/core";
import {
  ActivatedRoute,
  CanLoad,
  Route,
  Router,
  UrlSegment
} from "@angular/router";
import {
  LoginSuccessFulCallback,
  LOGIN_SUCCESSFUL_CALLBACK_TOKEN
} from "@irrigation/auth";
import { StoreService } from "@irrigation/shared/store";
import { BehaviorSubject, filter, map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserGuard implements CanLoad {
  public constructor(
    private readonly store: StoreService,
    private readonly router: Router,
    @Inject(LOGIN_SUCCESSFUL_CALLBACK_TOKEN)
    private readonly loginsuccessfulCallBack$: BehaviorSubject<
      LoginSuccessFulCallback | undefined
    >
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const queryParams =
      this.router.getCurrentNavigation()?.extractedUrl.queryParams;

    return this.store.user$.pipe(
      filter((user) => user !== undefined),
      map(Boolean),
      tap((canLoad) => {
        if (!canLoad) {
          this.loginsuccessfulCallBack$.next(() =>
            this.router.navigate([segments.join("/")], { queryParams })
          );
          this.router.navigateByUrl("auth/login");
        }
      })
    );
  }
}
