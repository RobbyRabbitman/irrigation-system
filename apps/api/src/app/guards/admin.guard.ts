import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PassportRequest } from '../model/Passport';

@Injectable()
export class AdminGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return context.switchToHttp().getRequest<PassportRequest>().user.admin;
  }
}
