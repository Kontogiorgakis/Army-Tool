import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomPanelComponent } from './bathroom-panel.component';

describe('BathroomPanelComponent', () => {
  let component: BathroomPanelComponent;
  let fixture: ComponentFixture<BathroomPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BathroomPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
