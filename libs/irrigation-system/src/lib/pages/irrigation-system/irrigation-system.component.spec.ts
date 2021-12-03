import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationSystemComponent } from './irrigation-system.component';

describe('IrrigationSystemComponent', () => {
  let component: IrrigationSystemComponent;
  let fixture: ComponentFixture<IrrigationSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigationSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrrigationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
