import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

export enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface HealthCheckOptions {
  name: string;
  healthFn?: () => Observable<Status>;
  subChecks?: HealthCheck[];
  description?: string;
}

export class HealthCheck {
  public status: Status;
  public ms: number;
  public readonly name: string;
  public readonly healthFn: () => Observable<Status>;
  public readonly subChecks?: HealthCheck[];
  public readonly description?: string;

  constructor({
    name,
    healthFn = () => of(Status.UP),
    subChecks,
    description,
  }: HealthCheckOptions) {
    this.name = name;
    this.healthFn = healthFn;
    this.subChecks = subChecks;
    this.description = description;
  }

  public evaluate(): Observable<HealthCheck> {
    return of(Date.now()).pipe(
      switchMap((start) =>
        of(this.subChecks).pipe(
          // evaluate sub checks
          switchMap((checks) =>
            checks?.length ?? 0 > 0
              ? forkJoin(this.subChecks.map((child) => child.evaluate())).pipe(
                  map((checks) =>
                    checks.some(({ status: status }) => status === Status.DOWN)
                      ? Status.DOWN
                      : Status.UP
                  )
                )
              : of(Status.UP)
          ),
          // evaluate this check: if all sub checks passed, trigger this check else return down
          switchMap((status) =>
            status === Status.UP ? this.healthFn() : of(status)
          ),
          // set time and status
          map((status) => {
            this.status = status;
            this.ms = Date.now() - start;
            return this;
          })
        )
      )
    );
  }
}
