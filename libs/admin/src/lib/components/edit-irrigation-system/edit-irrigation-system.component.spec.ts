import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIrrigationSystemComponent } from './edit-irrigation-system.component';

describe('EditIrrigationSystemComponent', () => {
  let component: EditIrrigationSystemComponent;
  let fixture: ComponentFixture<EditIrrigationSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIrrigationSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIrrigationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
