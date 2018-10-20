
import {of as observableOf,  Observable } from 'rxjs';
import {
  ComponentFixture, TestBed, getTestBed,
  async, fakeAsync, tick, flushMicrotasks,
  ComponentFixtureAutoDetect, discardPeriodicTasks
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { DataService } from '../model/data.service';
import { GeneralContext, GeneralContextImpl } from '../model/general-context';
import { NavComponent } from './nav.component';
import { EMPTY_EXAM, Exam } from 'app/model/exam';
import { EMPTY_QUESTION } from 'app/model/question';
import { Lib, KEY } from 'app/model/lib';

// ----------------------------------------------------------------------------
// Mocks

const QUESTION_URL = '/question'
const RESULTS_URL = '/results'
const DASHBOARD_URL = '/student-dash'

let CONFIRMATION = true
let contextMock = {
  confirm: (msg: string) => CONFIRMATION,
  alert: (msg: string) => null
}

let EXMRSLT0 = {
  id: 'er1729',
}

let NAV_EXAM = EMPTY_EXAM
let NAV_EXAM_RESULT = EMPTY_EXAM_RESULT
let dataServiceMock = {
  getExam: (eid) => NAV_EXAM_RESULT,
  finishExam: () => Promise.resolve(NAV_EXAM_RESULT),
  cancelExam: () => Promise.resolve(true),
  pauseExam: () => Promise.resolve(NAV_EXAM_RESULT),
  timerOnlyMe: (fn) => null
}

let routerMock = {
  navigate: (arr: any[]) => {
    // console.warn(arr)
  }
}

const ROUTER_PARAMS_MOCK = {
  eid: 'e1729',
  qid: 0,
}

let routeParamMock = {
  params: observableOf(ROUTER_PARAMS_MOCK)
}

const QUESTION0_CALL = [QUESTION_URL, NAV_EXAM_RESULT.id, 0]
const QUESTION1_CALL = [QUESTION_URL, NAV_EXAM_RESULT.id, 1]
const RESULTS_CALL = [RESULTS_URL, NAV_EXAM_RESULT.id]
const DASHBOARD_CALL = [DASHBOARD_URL]

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

function windowKeyDown(fixture: ComponentFixture<NavComponent>, key: string) {
  // fixture.nativeElement.dispatchEvent(event)
  // fixture.debugElement.triggerEventHandler('keydown.space', {});
  // http://pratibha02pandey.blogspot.in/2017/08/unit-testing-windowkeydown-event.html
  const event = new KeyboardEvent('keydown', { key: key });
  // console.warn('fn windowKeyDown', event.key)
  window.dispatchEvent(event);
  //  fixture.detectChanges();
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
  if (arr && n > 0) expect(navigateSpy).toHaveBeenCalledWith(arr);
  return navigateSpy
}

// ----------------------------------------------------------------------------

xdescribe('Nav Component Tests:', () => {

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
  }))

  it('Component created fine', fakeAsync(() => {
    ensureOnInit(fixture)
  }))

  describe('button click working:', () => {
    function navClickBase(selector: string, call: any[], count = 1, ok = false) {
      navigateTest(fixture, count, call, () => {
        CONFIRMATION = ok
        clickButton(fixture, selector)
      })
    }
    function navClick(selector: string, call: any[], count = 1, ok = false) {
      return fakeAsync(() => navClickBase(selector, call, count, ok))
    }

    it('Continue click working', navClick('#continue', QUESTION1_CALL))
    it('Results click working - cancel', navClick('#results', RESULTS_CALL, 0))
    it('Results click working - ok', navClick('#results', RESULTS_CALL, 1, true))

    it('Number button click working', navClick('#b0', QUESTION0_CALL))

    it('Dashboard click working - cancel', navClick('#cancel', DASHBOARD_CALL, 0))
    it('Dashboard click working - ok', navClick('#cancel', DASHBOARD_CALL, 1, true))

    it('pause button click working - unlocked', navClick('#pause', DASHBOARD_CALL))
    it('pause button click working - locked', fakeAsync(() => {
      NAV_EXAM_RESULT.lock()
      navClickBase('#pause', DASHBOARD_CALL, 0)
    }))
  })

  describe('Key press working:', () => {
    function navKey(key: KEY, call: any[], count = 1, ok = false) {
      return fakeAsync(() => {
        navigateTest(fixture, count, call, () => {
          CONFIRMATION = ok
          windowKeyDown(fixture, key)
        })
      })
    }
    it('right arrow key working', navKey(KEY.ARROW_RIGHT, QUESTION1_CALL))
    it('left arrow key working', navKey(KEY.ARROW_LEFT, RESULTS_CALL, 1, true))
    it('escape key working - cancel', navKey(KEY.ESCAPE, DASHBOARD_CALL, 0))
    it('escape key working - ok', navKey(KEY.ESCAPE, DASHBOARD_CALL, 1, true))

    xit('enter key working', fakeAsync(() => {
      console.warn('enter key working...')
      navigateTest(fixture, 0, QUESTION1_CALL, () => {
        NAV_EXAM_RESULT.setAnswer(0, 0)
        windowKeyDown(fixture, KEY.ENTER)
      })
    }))
  })

  describe('Number button classes working:', () => {
    function b0Check(attempted: boolean, correct: boolean, guessing: boolean, locked: boolean) {
      ensureOnInit(fixture)
      let button = fixture.debugElement.query(By.css('#b0'));
      expect(button.classes['attempted']).toBe(attempted)
      expect(button.classes['correct']).toBe(correct)
      expect(button.classes['guessing']).toBe(guessing)
      expect(button.classes['locked']).toBe(locked)
      expect(button.classes['selected']).toBe(true)
    }

    function cgl(correct: boolean, guessing = false, locked = false) {
      NAV_EXAM_RESULT.setAnswer(0, correct ? 0 : 1)
      // default is sure
      if (guessing) NAV_EXAM_RESULT.guessings[0] = true
      if (locked) NAV_EXAM_RESULT.lock()
      // guessing will not be seen until locked
      b0Check(true, correct, guessing, locked)
    }

    it('De Nuevo', fakeAsync(() => {
      b0Check(false, false, false, false)
    }))

    it('Wrong Surity Attempted', fakeAsync(() => cgl(false)))
    it('Wrong Guess Attempted', fakeAsync(() => cgl(false, true)))
    it('Wrong Surity Locked', fakeAsync(() => cgl(false, false, true)))
    it('Wrong Guess Locked', fakeAsync(() => cgl(false, true, true)))
    it('Right Surity Attempted', fakeAsync(() => cgl(true)))
    it('Right Guess Attempted', fakeAsync(() => cgl(true, true)))
    it('Right Surity Locked', fakeAsync(() => cgl(true, false, true)))
    it('Right Guess Locked', fakeAsync(() => cgl(true, true, true)))
  })
})

