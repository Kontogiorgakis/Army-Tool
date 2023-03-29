import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TropicalComponent } from './tropical.component';

describe('TropicalComponent', () => {
  let component: TropicalComponent;
  let fixture: ComponentFixture<TropicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TropicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TropicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
