import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationSystemCardComponent } from './irrigation-system-card.component';

describe('IrrigationSystemCardComponent', () => {
  let component: IrrigationSystemCardComponent;
  let fixture: ComponentFixture<IrrigationSystemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigationSystemCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrrigationSystemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
