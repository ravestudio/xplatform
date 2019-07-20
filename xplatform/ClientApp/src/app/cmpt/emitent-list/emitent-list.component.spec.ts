import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitentListComponent } from './emitent-list.component';

describe('EmitentListComponent', () => {
  let component: EmitentListComponent;
  let fixture: ComponentFixture<EmitentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
