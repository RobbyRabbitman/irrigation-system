import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './routes/admin-routing.module';
import { AdminComponent } from './pages/admin/admin.component';

@NgModule({
  imports: [CommonModule, AdminRoutingModule],
  declarations: [
    AdminComponent
  ],
})
export class AdminModule {}
