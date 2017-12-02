import {
  TestBed, async, inject, fakeAsync,
  discardPeriodicTasks, tick, getTestBed, flush
} from '@angular/core/testing';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Holders, DataService, DataSource, SecuritySource, isin } from './data.service';
import { FirebaseDataSource } from './firebase-data-source.service';
import { User, UserRole, EMPTY_USER } from './user';

import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { EMPTY_EXAM, Exam } from '../model/exam';
import { EMPTY_QUESTION } from '../model/question';
import { GeneralContext } from '../model/general-context';
import { FirebaseAPI } from '../model/firebase-api.service';
import { Lib } from '../model/lib';

const mockdata = {
  ver5: {
    exams: {
      e1: {
        by: 'A 1', name: 'E 1', revwhen: '7982-94-95', when: '2017-05-04',
        questions: {
          e1q01: {
            display: 'Q 1', notes: 'N 1', solutions: [1], type: 'TFQ',
          },
          e1q02: {
            display: 'Q 1', notes: 'N 1', solutions: [1], type: 'MCQ',
            choices: ['C 1', 'C 2', 'C 3'],
          },
        },
      },
      e2: {
        by: 'A 2', name: 'E 2', revwhen: '7982-94-95', when: '2017-05-04',
        questions: {
          e2q01: {
            display: 'Q 1', notes: 'N 1', solutions: [1], type: 'TFQ',
          },
          e2q02: {
            display: 'Q 1', notes: 'N 1', solutions: [1], type: 'TFQ',
            choices: ['C 1', 'C 2', 'C 3'],
          },
        },
      },
    },
    results: {
      u1: {
        r1: {
          exam: 'e1', revwhen: -1507038437147, status: 'DONE', when: 1507038437147,
          answers: {
            e1q1: [2],
          },
          durations: { 'nsejs1q01': 263, 'nsejs1q38': 91, },
          guessings: { 'nsejs1q01': false, 'nsejs1q02': false, },
        },
      }
    },
    users: [
      {
        localId: 'u1',
        email: 'bingo@gmail.com',
        displayName: 'Bingo User',
      },
      {
        localId: 'lid2',
        email: 'lid2@bingo.com',
        displayName: 'Localite 2',
      }
    ],
  }
}

function objToFbArr(obj): any[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach((key, index) => {
    let o = obj[key]
    o['$key'] = key
    arr.push(o)
  })
  return arr
}

function url2obj(url: string) {
  let props = url.substr(0, url.length - 1).split('/')
  let obj = mockdata
  props.forEach(p => obj = obj[p])
  // console.warn(url, obj)
  return obj
}

let firebaseAPIMock = {
  objectFirstMap: (url, fn) => {
    // console.warn('objectFirstMap', url)
    return Observable.of(url2obj(url)).map(x => fn(x))
  },
  listFirstMap: (url, fn) => {
    // console.warn('listFirstMap', url)
    return Observable.of(objToFbArr(url2obj(url))).map(x => fn(x))
  },
  listFirstMapR: (url, fn) => {
    // console.warn('listFirstMapR', url)
    return Observable.of(objToFbArr(url2obj(url))).map(x => fn(x))
  }
}

function makeSpy(cls: any, method: string) {
  return spyOn(getTestBed().get(cls), method).and.callThrough()
}

function resolvePromise(p) {
  let obj = null
  p.then(t => obj = t)
  flush()
  return obj
}

describe('FirebaseDataSource tests:', () => {

  let service: FirebaseDataSource

  beforeEach(() => {
    const injector = TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseAPI, useValue: firebaseAPIMock },
        { provide: FirebaseDataSource, useClass: FirebaseDataSource },
      ]
    })
    service = injector.get(FirebaseDataSource)
  })

  it('object checks', fakeAsync(() => {
    let holders: Holders = resolvePromise(service.getHolders(EMPTY_USER))
    expect(holders).not.toBeNull()
    expect(holders.users.length).toBe(2)
    expect(holders.exams.length).toBe(2)
    expect(holders.results.length).toBe(1)
  }))

})
