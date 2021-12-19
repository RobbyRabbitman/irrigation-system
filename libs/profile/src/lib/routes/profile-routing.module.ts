import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UserGuard } from '@irrigation/auth';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ROUTE_PROFILE } from './routes';

export const profileRoutes: Route[] = [
  {
    path: ROUTE_PROFILE,
    component: ProfileComponent,
    canActivate: [UserGuard],
  },
  { path: '**', redirectTo: ROUTE_PROFILE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
