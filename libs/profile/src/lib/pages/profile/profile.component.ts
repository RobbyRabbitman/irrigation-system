import { Component } from '@angular/core';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(public readonly store: StoreService) {}
}
