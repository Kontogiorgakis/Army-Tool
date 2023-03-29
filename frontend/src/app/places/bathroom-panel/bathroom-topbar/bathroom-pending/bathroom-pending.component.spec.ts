import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomPendingComponent } from './bathroom-pending.component';

describe('BathroomPendingComponent', () => {
  let component: BathroomPendingComponent;
  let fixture: ComponentFixture<BathroomPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BathroomPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
