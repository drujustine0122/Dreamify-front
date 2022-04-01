import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamSubfilterComponent } from './dream-subfilter.component';

describe('DreamSubfilterComponent', () => {
  let component: DreamSubfilterComponent;
  let fixture: ComponentFixture<DreamSubfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DreamSubfilterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DreamSubfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
