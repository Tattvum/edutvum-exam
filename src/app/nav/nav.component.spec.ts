import {
  ComponentFixture, TestBed, getTestBed,
  async, fakeAsync, tick, flushMicrotasks,
  ComponentFixtureAutoDetect, discardPeriodicTasks
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { DataService } from '../model/data.service';
import { GeneralContext, GeneralContextImpl } from '../model/general-context';
import { NavComponent } from './nav.component';
import { EMPTY_EXAM, Exam } from 'app/model/exam';
import { EMPTY_QUESTION } from 'app/model/question';

// ----------------------------------------------------------------------------
// Mocks

const QUESTION_URL = '/question'
const RESULTS_URL = '/results'
const DASHBOARD_URL = '/student-dash'

let CONFIRMATION = true
let contextMock = {
  confirm: (msg: string) => CONFIRMATION
}

let EXMRSLT0 = {
  id: 'er1729',
}

let NAV_EXAM = EMPTY_EXAM
let NAV_EXAM_RESULT = EMPTY_EXAM_RESULT
let dataServiceMock = {
  getExam: (eid) => NAV_EXAM_RESULT,
  saveExam: () => Promise.resolve(NAV_EXAM_RESULT)
}

let routerMock = {
  navigate: (arr: any[]) => null
}

const ROUTER_PARAMS_MOCK = {
  eid: 'e1729',
  qid: 0,
}

let routeParamMock = {
  params: Observable.of(ROUTER_PARAMS_MOCK)
}

// ----------------------------------------------------------------------------
// Helpers

function makeSpy(cls: any, method: string) {
  return spyOn(getTestBed().get(cls), method).and.callThrough()
}

function clickButton(fixture: ComponentFixture<NavComponent>, id: string) {
  let button = fixture.debugElement.query(By.css(id));
  button.triggerEventHandler('click', null)
  tick()
}

function ensureOnInit(fixture: ComponentFixture<NavComponent>): jasmine.Spy {
  let spy = makeSpy(DataService, 'getExam')
  fixture.detectChanges()
  discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
  expect(spy).toHaveBeenCalledWith(ROUTER_PARAMS_MOCK.eid)
  return spy
}

function baseTest(fixture: ComponentFixture<NavComponent>,
  body: () => void, n = 0): jasmine.Spy {
  let navigateSpy = makeSpy(Router, 'navigate')
  ensureOnInit(fixture)
  body()
  discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
  expect(navigateSpy).toHaveBeenCalledTimes(n);
  return navigateSpy
}

function navigateTest(fixture: ComponentFixture<NavComponent>,
  n: number, arr: any[], body: () => void): jasmine.Spy {
  let navigateSpy = baseTest(fixture, body, n)
  if (n > 0) expect(navigateSpy).toHaveBeenCalledWith(arr);
  return navigateSpy
}

// ----------------------------------------------------------------------------

describe('Nav Component Tests:', () => {

  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
      providers: [
        { provide: GeneralContext, useValue: contextMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeParamMock },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NavComponent)
      CONFIRMATION = true
      NAV_EXAM = new Exam('00', 'Bingo', [EMPTY_QUESTION, EMPTY_QUESTION])
      NAV_EXAM_RESULT = new ExamResult('00', 'Bingo', new Date(), NAV_EXAM)
    })
  }));

  it('Component created fine', fakeAsync(() => {
    ensureOnInit(fixture)
  }))

  it('Continue click working', fakeAsync(() => {
    navigateTest(fixture, 1, [QUESTION_URL, NAV_EXAM_RESULT.id, 1], () => {
      clickButton(fixture, '#continue')
    })
  }))

  it('Results click working - confirm false', fakeAsync(() => {
    navigateTest(fixture, 0, null, () => {
      CONFIRMATION = false
      clickButton(fixture, '#results')
    })
  }))
  it('Results click working - confirm true', fakeAsync(() => {
    navigateTest(fixture, 1, [RESULTS_URL, NAV_EXAM_RESULT.id], () => {
      CONFIRMATION = true
      clickButton(fixture, '#results')
    })
  }))

  it('Number button click working', fakeAsync(() => {
    navigateTest(fixture, 1, [QUESTION_URL, NAV_EXAM_RESULT.id, 0], () => {
      clickButton(fixture, '#b0')
    })
  }))

  it('Back to dash link click working - confirm false', fakeAsync(() => {
    navigateTest(fixture, 0, null, () => {
      CONFIRMATION = false
      clickButton(fixture, '#back')
    })
  }))
  it('Back to dash link click working - confirm true', fakeAsync(() => {
    navigateTest(fixture, 1, [DASHBOARD_URL], () => {
      clickButton(fixture, '#back')
    })
  }))

  function b0Check(done: boolean, wrong: boolean, selected = true) {
    ensureOnInit(fixture)
    let button = fixture.debugElement.query(By.css('#b0'));
    expect(button.classes['done']).toBe(done)
    expect(button.classes['wrong']).toBe(wrong)
    expect(button.classes['selected']).toBe(selected)
  }

  it('Number button classes working - scratch', fakeAsync(() => {
    b0Check(false, false)
  }))
  it('Number button classes working - attempted wrong', fakeAsync(() => {
    NAV_EXAM_RESULT.setAnswer(0, 1)
    b0Check(true, false)
  }))
  it('Number button classes working - attempted right', fakeAsync(() => {
    NAV_EXAM_RESULT.setAnswer(0, 0)
    b0Check(true, false)
  }))
  it('Number button classes working - done wrong', fakeAsync(() => {
    NAV_EXAM_RESULT.setAnswer(0, 1)
    NAV_EXAM_RESULT.lock()
    b0Check(true, true)
  }))
  it('Number button classes working - done right', fakeAsync(() => {
    NAV_EXAM_RESULT.setAnswer(0, 0)
    NAV_EXAM_RESULT.lock()
    b0Check(true, false)
  }))
})

