import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileRoutingModule } from './routes/profile-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, MatCardModule, MatListModule],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
