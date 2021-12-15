import { Component } from '@angular/core';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  public constructor(public readonly store: StoreService) {}
}
