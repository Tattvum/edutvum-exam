/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExamResultComponent } from './exam-result.component';

describe('ExamResultComponent', () => {
  let component: ExamResultComponent;
  let fixture: ComponentFixture<ExamResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
