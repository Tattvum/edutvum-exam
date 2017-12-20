import {
  TestBed, async, inject, fakeAsync,
  discardPeriodicTasks, tick, getTestBed, flush
} from '@angular/core/testing';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Holders } from './data.service';
import * as fbs from './firebase-data-source.service';
import { FirebaseDataSource } from './firebase-data-source.service';
import { User, UserRole, EMPTY_USER } from './user';

import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { EMPTY_EXAM, Exam } from '../model/exam';
import { EMPTY_QUESTION } from '../model/question';
import { GeneralContext } from '../model/general-context';
import { FirebaseAPI } from '../model/firebase-api.service';
import { Lib } from '../model/lib';
import { AnswerType } from 'app/model/answer-type';

const mockdata = {
  ver5: {
    exams: {
      e1: {
        by: 'A 1', name: 'E 1', revwhen: '7982-94-95', when: '2017-05-04',
        questions: {
          e1q01: {
            display: 'Q 1', notes: 'N 1', solutions: [1], type: 'MCQ',
            choices: ['C 1', 'C 2', 'C 3'],
          },
          e1q02: {
            display: 'Q 2', notes: 'N 2', solutions: [0, 2], type: 'MAQ',
            choices: ['C 1', 'C 2', 'C 3'],
          },
          e1q03: {
            display: 'Q 3', notes: 'N 3', solutions: [0], type: 'TFQ',
          },
          e1q04: {
            display: 'Q 4', notes: 'N 4', solutions: [0], type: 'ARQ',
          },
          e1q05: {
            display: 'Q 5', notes: 'N 4', solutions: [273], type: 'NCQ',
          },
          e1q06: {
            display: 'Q 6',
            kind: 'GROUP',
            questions: {
              e1q06s1: {
                display: 's1', notes: 'N', solutions: [0], type: 'TFQ',
              },
              e1q06s2: {
                display: 's2', notes: 'N', solutions: [0], type: 'TFQ',
              },
              e1q06s3: {
                display: 'Q 6',
                kind: 'GROUP',
                questions: {
                  e1q06s3s1: {
                    display: 's3', notes: 'N', solutions: [0], type: 'TFQ',
                  },
                  e1q06s3s2: {
                    display: 's4', notes: 'N', solutions: [0], type: 'TFQ',
                  }
                }
              }
            }
          }
        },
      },
      e2: {
        by: 'A 2', name: 'E 2', revwhen: '7982-94-95', when: '2017-05-04',
        questions: {
          e2q01: {
            eid: 'e1', qid: 'e1q01', kind: 'LINK'
          },
          e2q02: {
            display: 'Q 1', notes: 'N 1', solutions: [0, 2], type: 'MAQ',
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
            e1q01: [0], e1q03: [1],
          },
          durations: { 'e1q01': 263, 'e1q03': 91, },
          guessings: { 'e1q01': true, 'e1q03': false, },
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
  objectFirstMap: url => Promise.resolve(url2obj(url)),
  listFirstMap: url => Promise.resolve(objToFbArr(url2obj(url))),
  listFirstMapR: url => Promise.resolve(objToFbArr(url2obj(url))),
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

describe('FirebaseDataSource -', () => {

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

  it('Overall object checks -', fakeAsync(() => {
    let holders: Holders = resolvePromise(service.getHolders(EMPTY_USER))
    expect(holders).not.toBeNull()
    expect(holders.users.length).toBe(2)
    expect(holders.exams.length).toBe(2)
    expect(holders.results.length).toBe(1)
  }))

  describe('ExamResult conversion -', () => {
    let e = null;
    e = mockdata.ver5.exams['e1']
    e['$key'] = 'e1'
    let e1 = fbs.createE(e)
    e = mockdata.ver5.exams['e2']
    e['$key'] = 'e2'
    let e2 = fbs.createE(e)
    let exams = { 'e1': e1, 'e2': e2 }
    function rCheckForward(rkey) {
      let r = mockdata.ver5.results.u1[rkey]
      r['$key'] = rkey
      let r_ = fbs.createR(r, exams)
      expect(r_).not.toBeNull()
    }
    function rCheckReverse(rkey) {
      let r = mockdata.ver5.results.u1[rkey]
      r['$key'] = rkey
      let r_ = fbs.createR(r, exams)
      let r_r = fbs.convertExamResult(r_)
      expect(r_).not.toBeNull()
    }
    it('Forward checks -', () => {
      rCheckForward('r1')
    })
    it('Reverse checks -', () => {
      rCheckReverse('r1')
    })
  })

  describe('Exam conversion -', () => {
    function eCheckForward(ekey) {
      let e = mockdata.ver5.exams[ekey]
      let e_ = fbs.createE(e)
      expect(e_).not.toBeNull()
      expect(e_.title).toBe(e.name)
    }
    function eCheckReverse(ekey) {
      let e = mockdata.ver5.exams[ekey]
      let e_ = fbs.createE(e)
      let e_e = fbs.convertPureExam(e_, EMPTY_USER)
      expect(e_e).not.toBeNull()
      expect(e_e.name).toBe(e.name)
    }
    it('Forward checks -', () => {
      eCheckForward('e1')
      // NOTE: This depends on e1 being the first.
      // LINK questions depend on the original
      eCheckForward('e2')
    })
    it('reverse checks -', () => {
      eCheckReverse('e1')
    })
  })

  describe('Question conversion -', () => {
    function qCheckForward(ekey, qkey, lekey = ekey, lqkey = qkey) {
      let q = mockdata.ver5.exams[ekey].questions[qkey]
      let lq = mockdata.ver5.exams[lekey].questions[lqkey]
      let q_ = fbs.createQ(q, qkey, ekey)[0]
      expect(q_).not.toBeNull()
      expect(q_.eid).toBe(lekey)
      expect(q_.id).toBe(lqkey)
      expect(q_.title).toBe(lq.display)
      expect(q_.type).toBe(AnswerType[lq.type + ''])
      expect(q_.groups.length).toBe(0)
    }
    it('Forward checks -', () => {
      qCheckForward('e1', 'e1q01')
      qCheckForward('e1', 'e1q02')
      qCheckForward('e1', 'e1q03')
      qCheckForward('e1', 'e1q04')
      qCheckForward('e2', 'e2q01', 'e1', 'e1q01')
      qCheckForward('e2', 'e2q02')
    })

    function qCheckReverse(ekey, qkey) {
      let q = mockdata.ver5.exams[ekey].questions[qkey]
      let q_ = fbs.createQ(q, qkey, ekey)
      let q_q = fbs.convertQuestion(q_[0])
      expect(q_q).not.toBeNull()
      expect(q_q.display).toBe(q.display)
    }
    it('Reverse checks -', () => {
      qCheckReverse('e1', 'e1q01')
      qCheckReverse('e1', 'e1q02')
      // reverse check for link question not possible
      qCheckReverse('e2', 'e2q02')
    })

    function qGroupCheckForward(ekey, qkey) {
      let q = mockdata.ver5.exams[ekey].questions[qkey]
      let q_ = fbs.createQ(q, qkey, ekey)
      expect(q_).not.toBeNull()
      expect(q_.length).toBe(4)
      expect(q_[0].groups.length).toBe(1)
      expect(q_[1].groups.length).toBe(1)
      expect(q_[2].groups.length).toBe(2)
      expect(q_[3].groups.length).toBe(2)
    }
    it('GROUP Forward checks -', () => {
      qGroupCheckForward('e1', 'e1q06')
    })
  })

})
