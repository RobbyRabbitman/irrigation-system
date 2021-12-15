import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationSystemOverviewComponent } from './irrigation-system-overview.component';

describe('IrrigationSystemOverviewComponent', () => {
  let component: IrrigationSystemOverviewComponent;
  let fixture: ComponentFixture<IrrigationSystemOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IrrigationSystemOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrrigationSystemOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
