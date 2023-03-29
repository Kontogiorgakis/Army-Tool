import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomOralComponent } from './bathroom-oral.component';

describe('BathroomOralComponent', () => {
  let component: BathroomOralComponent;
  let fixture: ComponentFixture<BathroomOralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BathroomOralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
