import { Component, OnInit } from '@angular/core';
import { UpdateUserDTO } from '@irrigation/generated/client';
import { StoreService } from '@irrigation/shared/store';

@Component({
  selector: 'irrigation-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(public readonly store: StoreService) {}

  ngOnInit(): void {
    this.store.dispatchGetAllUsers().subscribe();
  }

  public _onEdit(id: string, dto: UpdateUserDTO): void {
    this.store.dispatchUpdateUser(id, dto).subscribe();
  }
}
