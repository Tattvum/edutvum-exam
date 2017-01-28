/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExamDashComponent } from './exam-dash.component';

describe('ExamDashComponent', () => {
  let component: ExamDashComponent;
  let fixture: ComponentFixture<ExamDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
