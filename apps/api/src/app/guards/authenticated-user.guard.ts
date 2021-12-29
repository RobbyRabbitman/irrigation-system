import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PassportRequest } from '../model/Passport';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return context.switchToHttp().getRequest<PassportRequest>()?.user
      ?.authenticated;
  }
}
