import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { ROUTE_AUTH_LOGIN } from './routes';

export const authRoutes: Route[] = [
  {
    path: ROUTE_AUTH_LOGIN,
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: ROUTE_AUTH_LOGIN,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
