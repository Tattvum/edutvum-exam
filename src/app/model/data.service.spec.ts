/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {
  DataService,
  Exam, Question, Results, AnswerType
} from './data.service';
import { TestableMockDataService } from './testable-mock-data.service';

describe('StudentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataService, useClass: TestableMockDataService },
      ]
    });
  });

  it('Test Me Now!', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
    expect(service.testMe(3)).toBe(6)
  }));
});

describe('Question TFQ works', () => {
  let q = new Question()

  beforeEach(() => {
    q.type = AnswerType.TFQ
    q.choices[0] = "choice 1"
    q.choices[1] = "choice 2"
    q.solutions[1] = true
  })

  it('No answer', () => {
    expect(q.isDone()).toBeFalsy()
    //No answers, so not wrong
    expect(q.isWrong()).toBeFalsy()
    //has answer but false = not answered - so NOT wrong!
    q.answers[0] = null
    q.answers[1] = false
    expect(q.isWrong()).toBeFalsy()
    //clear all answers
    q.clearAllAnswers()
    expect(q.isWrong()).toBeFalsy()
  })
  it('Has answer', () => {
    //wrong answer - so wrong
    q.answers[0] = true
    expect(q.isWrong()).toBeTruthy()
    //many answer - so still wrong
    q.answers[1] = true
    expect(q.isWrong()).toBeTruthy()
    //only right answer - so not wrong
    q.answers[0] = null
    q.answers[1] = true
    expect(q.isWrong()).toBeFalsy()
    //safe set answer wrong
    q.setAnswer(0)
    expect(q.isWrong()).toBeTruthy()
    //safe set answer right
    q.setAnswer(1)
    expect(q.isWrong()).toBeFalsy()
    //anyway done
    expect(q.isDone()).toBeTruthy()
  })
})

describe('Question MCQ works', () => {
  let q = new Question()

  beforeEach(() => {
    q.type = AnswerType.MCQ
    q.choices[0] = "choice 0"
    q.choices[1] = "choice 1"
    q.choices[2] = "choice 2"
    q.choices[3] = "choice 3"
    q.solutions[2] = true
  })

  it('No answer', () => {
    expect(q.isDone()).toBeFalsy()
    //No answers, so not wrong
    expect(q.isWrong()).toBeFalsy()
    //has answer but false = not answered - so NOT wrong!
    q.answers[0] = null
    q.answers[2] = false
    expect(q.isWrong()).toBeFalsy()
    //clear all answers
    q.clearAllAnswers()
    expect(q.isWrong()).toBeFalsy()
  })
  it('Has answer', () => {
    //wrong answer - so wrong
    q.answers[0] = true
    expect(q.isWrong()).toBeTruthy()
    //many answer - so still wrong
    q.answers[1] = true
    expect(q.isWrong()).toBeTruthy()
    //only right answer - so not wrong
    q.answers[0] = null
    q.answers[1] = false
    q.answers[2] = true
    expect(q.isWrong()).toBeFalsy()
    //safe set answer wrong
    q.setAnswer(0)
    expect(q.isWrong()).toBeTruthy()
    //safe set answer right
    q.setAnswer(2)
    expect(q.isWrong()).toBeFalsy()
    //anyway done
    expect(q.isDone()).toBeTruthy()
  })
})

describe('Question MAQ works', () => {
  let q = new Question()

  beforeEach(() => {
    q.type = AnswerType.MAQ
    q.choices[0] = "choice 0"
    q.choices[1] = "choice 1"
    q.choices[2] = "choice 2"
    q.choices[3] = "choice 3"
    q.solutions[1] = true
    q.solutions[3] = true
  })

  it('No answer', () => {
    expect(q.isDone()).toBeFalsy()
    //No answers, so not wrong
    expect(q.isWrong()).toBeFalsy()
    //has answer but false = not answered - so NOT wrong!
    q.answers[0] = null
    q.answers[1] = false
    expect(q.isWrong()).toBeFalsy()
    //clear all answers
    q.clearAllAnswers()
    expect(q.isWrong()).toBeFalsy()
  })
  it('Has answer', () => {
    //wrong answer - so wrong
    q.answers[0] = true
    expect(q.isWrong()).toBeTruthy()
    //many answer - so still wrong
    q.answers[1] = true
    expect(q.isWrong()).toBeTruthy()
    //only right answer - so not wrong
    q.answers[0] = null
    q.answers[1] = true
    q.answers[2] = false
    q.answers[3] = true
    expect(q.isWrong()).toBeFalsy()
    //safe set answer wrong
    q.setAnswer(0)
    expect(q.isWrong()).toBeTruthy()
    //safe set answer right
    q.clearAllAnswers()
    q.setAnswer(1)
    q.setAnswer(3)
    expect(q.isWrong()).toBeFalsy()
    //anyway done
    expect(q.isDone()).toBeTruthy()
  })
})

describe('Results works', () => {
  let r = new Results()

  it('Yes it does', () => {
    r.correct = 1
    r.total = 4
    r.leftout = 1
    r.wrong = 1
    //percentage works
    expect(r.percent()).toBe(25)
    r.total = 5
    expect(r.percent()).toBe(20)
    r.correct = 2
    expect(r.percent()).toBe(40)
    //decimal works
    r.total = 7
    expect(r.percent()).toBe(29)//28.571..
    //only correct and total matters
    r.leftout = 2
    r.wrong = 3
    expect(r.percent()).toBe(29)
  })
})

describe('Exam works', () => {
  let e = new Exam()

  it('Defaults asserted', () => {
    //assert defaults
    expect(e.inAnswerMode).toBe(false)
    expect(e.isResultsPage()).toBe(false)
    //oh, now it is neither in results nor has any questions!
    //what will be shown? TBD
    //for now ensure there is atleast one question!
    expect(e.qs.length).toBe(0)
  })

  it('Working with 1 question', () => {
    let q = new Question()
    q.type = AnswerType.TFQ
    q.choices[0] = "Ch 0.0"
    q.choices[1] = "Ch 0.1"
    q.solutions[1] = true
    e.qs.push(q)
    //question is not selected unless you select it
    expect(e.qs[0].isSelected).toBe(false)
    //select works
    e.select(0)
    expect(e.qs[0].isSelected).toBe(true)
    //donot select the non existant question
    expect(() => e.select(1)).toThrow()
    //select none = selected is null = results page
    e.selectNone()
    expect(e.isResultsPage()).toBe(true)
    //next after last is null
    e.select(0)
    expect(e.isResultsPage()).toBe(false)
    expect(e.next()).toBe(null)
    //...so, set null
    e.selectNone()
    expect(e.isResultsPage()).toBe(true)
  })

  it('Working with 2 questions', () => {
    //adding second question
    let q = new Question()
    q.type = AnswerType.MCQ
    q.choices[0] = "Ch 1.0"
    q.choices[1] = "Ch 1.1"
    q.choices[2] = "Ch 1.2"
    q.solutions[2] = true
    e.qs.push(q)
    //question is not selected unless you select it
    expect(e.qs[0].isSelected).toBe(false)
    //select works
    e.select(0)
    expect(e.qs[0].isSelected).toBe(true)
    //donot select the non existant question
    expect(() => e.select(2)).toThrow()
    //select none = selected is null = results page
    e.selectNone()
    expect(e.isResultsPage()).toBe(true)
    //next after last is null
    e.select(0)
    expect(e.isResultsPage()).toBe(false)
    expect(e.next()).toBe(1)
    e.select(1)
    expect(e.isResultsPage()).toBe(false)
    expect(e.next()).toBe(null)
    //...so, set null
    e.selectNone()
    expect(e.isResultsPage()).toBe(true)
  })
})
