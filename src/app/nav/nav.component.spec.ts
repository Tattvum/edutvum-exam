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

// ----------------------------------------------------------------------------
// Mocks

let contextMock_cond = true
let contextMock = {
  init: (cond: boolean) => contextMock_cond = cond,
  confirm: (msg: string) => contextMock_cond
}

let EXMRSLT = EMPTY_EXAM_RESULT
let dataServiceMock = {
  init: (obj) => EXMRSLT = obj,
  getExam: (eid) => EXMRSLT,
  saveExam: () => Promise.resolve(EXMRSLT)
}

let routerMock = {
  navigate: (arr: any[]) => null
}

const ROUTER_PARAMS_MOCK = {
  eid: 'e1729',
  qid: 1729,
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
  discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
  tick()
}

function ensureOnInit(fixture: ComponentFixture<NavComponent>): jasmine.Spy {
  let spy = makeSpy(DataService, 'getExam')
  fixture.detectChanges()
  expect(spy).toHaveBeenCalledWith(ROUTER_PARAMS_MOCK.eid)
  return spy
}

function navigateTest(fixture: ComponentFixture<NavComponent>,
  n: number, arr: any[], body: () => void) {
  let navigateSpy = makeSpy(Router, 'navigate')
  ensureOnInit(fixture)
  body()
  expect(navigateSpy).toHaveBeenCalledTimes(n);
  if (n > 0) expect(navigateSpy).toHaveBeenCalledWith(arr);
}

// ----------------------------------------------------------------------------

describe('Nav Component Tests:', () => {

  let comp: NavComponent;
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
      comp = fixture.componentInstance
    })
  }));

  it('Component created fine', () => {
    ensureOnInit(fixture)
  })

  it('Continue click working', fakeAsync(() => {
    navigateTest(fixture, 1, ['/results', EXMRSLT.id], () => {
      clickButton(fixture, '#continue')
    })
  }))

  it('Results click working - confirm false', fakeAsync(() => {
    navigateTest(fixture, 0, null, () => {
      contextMock.init(false)
      clickButton(fixture, '#results')
    })
  }))

  it('Results click working - confirm true', fakeAsync(() => {
    navigateTest(fixture, 1, ['/results', EXMRSLT.id], () => {
      contextMock.init(true)
      clickButton(fixture, '#results')
    })
  }))

})

