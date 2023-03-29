import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YogurtComponent } from './yogurt.component';

describe('YogurtComponent', () => {
  let component: YogurtComponent;
  let fixture: ComponentFixture<YogurtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YogurtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YogurtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
