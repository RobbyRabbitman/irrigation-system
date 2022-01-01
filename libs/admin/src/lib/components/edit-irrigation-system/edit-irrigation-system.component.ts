import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreatePumpDTO,
  IrrigationSystem,
  Pump,
} from '@irrigation/generated/client';

@Component({
  selector: 'irrigation-edit-irrigation-system',
  templateUrl: './edit-irrigation-system.component.html',
  styleUrls: ['./edit-irrigation-system.component.scss'],
})
export class EditIrrigationSystemComponent {
  public readonly addPumpForm_name = 'name';
  public readonly addPumpForm = new FormGroup({
    [this.addPumpForm_name]: new FormControl(null, Validators.required),
  });

  @Input()
  public irrigationSystem?: IrrigationSystem;

  @Output()
  public readonly addPump = new EventEmitter<CreatePumpDTO>();

  @Output()
  public readonly deletePump = new EventEmitter<Pump>();

  public _onSubmit(): void {
    if (this.addPumpForm.valid)
      this.addPump.emit({
        name: this.addPumpForm.value[this.addPumpForm_name],
      });
  }
}
