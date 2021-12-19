import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ErrorService } from '../error.service';

export const HTTP_ERROR_CODES = new InjectionToken<number[]>('', {
  providedIn: 'root',
  factory: () => [500], //TODO reg ex instead?
});

@Injectable({ providedIn: 'root' })
export class HttpStatusCodeInterceptor implements HttpInterceptor {
  private readonly default = { message: 'Upsi :(', name: 'Error' }; //TODO token?

  constructor(
    private readonly errorService: ErrorService,
    @Inject(HTTP_ERROR_CODES) private readonly codes: number[]
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        if (this.codes.includes(res.status))
          this.errorService.showErrorInDialog({
            ...this.default,
            ...res.error,
          });
        return throwError(() => res);
      }),
      tap((res) => {
        if (res instanceof HttpResponse && this.codes.includes(res.status)) {
          this.errorService.showErrorInDialog({
            ...this.default,
            ...(res.body as object),
          });
        }
      })
    );
  }
}
