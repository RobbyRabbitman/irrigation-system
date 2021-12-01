import { Component } from '@angular/core';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public readonly store: StoreService) {
    store.dispatchLogin({ password: '123', username: '123' }).subscribe();
  }
}
