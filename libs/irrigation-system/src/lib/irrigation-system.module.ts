import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { IrrigationSystemOverviewComponent } from './pages/irrigation-system-overview/irrigation-system-overview.component';
import { IrrigationSystemCardComponent } from './components/irrigation-system-card/irrigation-system-card.component';
import { IrrigationSystemComponent } from './pages/irrigation-system/irrigation-system.component';
import { IrrigationSystemRoutingModule } from './routes/irrigation-system-routing.module';

@NgModule({
  imports: [CommonModule, IrrigationSystemRoutingModule, MatCardModule],
  declarations: [
    IrrigationSystemOverviewComponent,
    IrrigationSystemCardComponent,
    IrrigationSystemComponent,
  ],
})
export class IrrigationSystemModule {}
