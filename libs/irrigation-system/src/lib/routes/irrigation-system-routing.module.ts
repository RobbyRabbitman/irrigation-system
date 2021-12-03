import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IrrigationSystemOverviewComponent } from '../pages/irrigation-system-overview/irrigation-system-overview.component';
import { IrrigationSystemComponent } from '../pages/irrigation-system/irrigation-system.component';
import {
  ROUTE_IRRIGATION_SYSTEM_OVERVIEW,
  ROUTE_IRRIGATION_SYSTEM,
} from './routes';

export const irrigationSystemRoutes: Route[] = [
  {
    path: ROUTE_IRRIGATION_SYSTEM_OVERVIEW,
    component: IrrigationSystemOverviewComponent,
  },
  {
    path: `${ROUTE_IRRIGATION_SYSTEM}`,
    component: IrrigationSystemComponent,
  },
  {
    path: '**',
    redirectTo: ROUTE_IRRIGATION_SYSTEM_OVERVIEW,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(irrigationSystemRoutes)],
  exports: [RouterModule],
})
export class IrrigationSystemRoutingModule {}
