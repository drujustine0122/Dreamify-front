import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamSidebarComponent } from './dream-sidebar.component';

describe('DreamSidebarComponent', () => {
  let component: DreamSidebarComponent;
  let fixture: ComponentFixture<DreamSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DreamSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DreamSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
