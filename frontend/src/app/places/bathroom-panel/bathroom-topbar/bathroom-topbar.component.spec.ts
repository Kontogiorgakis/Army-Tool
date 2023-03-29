import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomTopbarComponent } from './bathroom-topbar.component';

describe('BathroomTopbarComponent', () => {
  let component: BathroomTopbarComponent;
  let fixture: ComponentFixture<BathroomTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BathroomTopbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
