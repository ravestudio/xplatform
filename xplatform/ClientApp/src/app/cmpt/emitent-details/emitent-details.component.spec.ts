import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitentDetailsComponent } from './emitent-details.component';

describe('EmitentDetailsComponent', () => {
  let component: EmitentDetailsComponent;
  let fixture: ComponentFixture<EmitentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
