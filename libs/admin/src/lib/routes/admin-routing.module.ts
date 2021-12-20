import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminComponent } from '../pages/admin/admin.component';
import { ROUTE_ADMIN } from './routes';

export const adminRoutes: Route[] = [
  {
    path: ROUTE_ADMIN,
    component: AdminComponent,
  },
  {
    path: '**',
    redirectTo: ROUTE_ADMIN,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
