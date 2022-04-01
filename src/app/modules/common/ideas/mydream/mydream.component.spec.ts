import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MydreamComponent } from './mydream.component';

describe('MydreamComponent', () => {
  let component: MydreamComponent;
  let fixture: ComponentFixture<MydreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MydreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MydreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
