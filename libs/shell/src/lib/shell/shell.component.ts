import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  public constructor(
    public readonly store: StoreService,
    private readonly router: Router
  ) {}

  public _onLogout(): void {
    this.store
      .dispatchLogout()
      .subscribe({ next: () => this.router.navigateByUrl('') });
  }
}
