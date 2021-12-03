import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationTimelineComponent } from './irrigation-timeline.component';

describe('IrrigationTimelineComponent', () => {
  let component: IrrigationTimelineComponent;
  let fixture: ComponentFixture<IrrigationTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigationTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrrigationTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
