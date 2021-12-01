import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { IrrigationSystemOverviewComponent } from './pages/irrigation-system-overview/irrigation-system-overview.component';

export const irrigationSystemRoutes: Route[] = [
  {
    path: '',
    component: IrrigationSystemOverviewComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(irrigationSystemRoutes)],
  declarations: [IrrigationSystemOverviewComponent],
})
export class IrrigationSystemModule {}
