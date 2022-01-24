import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { catchError, forkJoin, map, mapTo, Observable, of } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthenticatedUserGuard } from '../guards/authenticated-user.guard';
import { Status, HealthCheck } from '../model/api/health/health.model';
import { PassportRequest } from '../model/Passport';
import { UserService } from '../user/user.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly userService: UserService
  ) {}

  @ApiOkResponse()
  @Get('ping')
  public ping() {
    return;
  }

  @UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HealthCheck, isArray: true })
  @Get('status')
  public status(@Req() req: PassportRequest): Observable<HealthCheck[]> {
    return forkJoin(
      [
        new HealthCheck({
          name: 'Database',
          healthFn: () =>
            of(this.connection.readyState).pipe(
              map((state) => (state === 1 ? Status.UP : Status.DOWN))
            ),
          subChecks: [
            new HealthCheck({
              name: 'Connection',
              healthFn: () =>
                of(this.connection.readyState).pipe(
                  map((state) => (state === 1 ? Status.UP : Status.DOWN))
                ),
            }),
            new HealthCheck({
              name: 'Average Query Response Time',
              healthFn: () =>
                this.userService.findOneById(req.user.id).pipe(
                  mapTo(Status.UP),
                  catchError(() => of(Status.DOWN))
                ),
            }),
          ],
        }),
      ].map((x) => x.evaluate())
    );
  }
}
