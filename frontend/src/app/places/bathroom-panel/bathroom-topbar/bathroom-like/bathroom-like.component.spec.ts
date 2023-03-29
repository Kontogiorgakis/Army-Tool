import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomLikeComponent } from './bathroom-like.component';

describe('BathroomLikeComponent', () => {
  let component: BathroomLikeComponent;
  let fixture: ComponentFixture<BathroomLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BathroomLikeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
