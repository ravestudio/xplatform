import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialEditComponent } from './financial-edit.component';

describe('FinancialEditComponent', () => {
  let component: FinancialEditComponent;
  let fixture: ComponentFixture<FinancialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
