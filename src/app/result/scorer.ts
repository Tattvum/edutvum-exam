import { AnswerType } from '../model/answer-type';
import { Question } from '../model/question';
import { ExamResult } from 'app/model/exam-result';

interface Q {
  guessed(): boolean
  status(): number // +1 correct, 0 skipped, -1 wrong
  marks(): number
  max(): number
}

function asQArr_Simple(ex: ExamResult): Q[] {
  return ex.questions.map((_, qid) => {
    return {
      "guessed": () => ex.guessings[qid],
      "status": () => ex.isAttempted(qid) ? ex.isCorrect(qid) ? +1 : -1 : 0,
      "marks": () => ex.isAttempted(qid) ? 1 : 0,
      "max": () => 1,
    }
  })
}

function asQArr_Percent(ex: ExamResult): Q[] {
  let count = ex.questions.length
  let qpercent = 100 / count
  return ex.questions.map((_, qid) => {
    return {
      "guessed": () => ex.guessings[qid],
      "status": () => ex.isAttempted(qid) ? ex.isCorrect(qid) ? +1 : -1 : 0,
      "marks": () => ex.isAttempted(qid) ? qpercent : 0,
      "max": () => qpercent,
    }
  })
}

//TBD Is this optimal? NO!
function asQArr_JEE(ex: ExamResult): Q[] {
  return ex.questions.map((_, qid) => {
    return {
      "guessed": () => ex.guessings[qid],
      "status": () => ex.isAttempted(qid) ? ex.isCorrect(qid) ? +1 : -1 : 0,
      "marks": () => {
        let q = ex.questions[qid]
        let sols = ex.questions[qid].solutions
        let anss = ex.answers[qid]
        if (!ex.isAttempted(qid)) return 0
        //ASSERT 4 choices exactly!!
        if (q.type !== AnswerType.MAQ) return ex.isCorrect(qid) ? +3 : -1
        //ASSERT answers are non-duplicated
        let m = 0
        for (let a of anss) if (!sols.includes(a)) m++
        //ASSERT 4 choices exactly!!
        if (anss.length === sols.length && anss.length === m) return +4
        else if (m < sols.length) return m
        else if (m < anss.length) return -2
      },
      "max": () => ex.questions[qid].type === AnswerType.MAQ ? +4 : +3,
    }
  })
}

export enum Modes { Simple, JEE, Percent }

export class Scorer {
  private _mode = Modes.Simple

  q1: Q[] = []
  q2: Q[] = []
  q3: Q[] = []

  qs: Q[] = []

  constructor(readonly ex: ExamResult) {
    //TBD: Again not at all optimal
    this.q1 = asQArr_Simple(ex)
    this.q2 = asQArr_JEE(ex)
    this.q3 = asQArr_Percent(ex)
    this.qs = this.q1
  }

  get mode(): Modes { return this._mode }
  set mode(mode: Modes) {
    this._mode = mode
    switch (mode) {
      case Modes.Simple: this.qs = this.q1; break
      case Modes.JEE: this.qs = this.q2; break
      case Modes.Percent: this.qs = this.q3; break
    }
  }

  get skipped(): number { 
    return this.qs.filter((q: Q) => q.status() === 0).map(q => q.max()).reduce((sum, qm) => sum += qm, 0) 
  }

  private sumMarks(condition: (q: Q) => boolean): number {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Reduce_of_empty_array_with_no_initial_value
    return this.qs.filter(condition).map(q => q.marks()).reduce((sum, qm) => sum += qm, 0)
  }

  get cs(): number { return this.sumMarks((q: Q) => !q.guessed() && q.status() > 0) }
  get cg(): number { return this.sumMarks((q: Q) => q.guessed() && q.status() > 0) }
  get ws(): number { return this.sumMarks((q: Q) => !q.guessed() && q.status() < 0) }
  get wg(): number { return this.sumMarks((q: Q) => q.guessed() && q.status() < 0) }

  get c(): number { return this.sumMarks((q: Q) => q.status() > 0) }
  get w(): number { return this.sumMarks((q: Q) => q.status() < 0) }
  get s(): number { return this.sumMarks((q: Q) => !q.guessed()) }
  get g(): number { return this.sumMarks((q: Q) => q.guessed()) }

  get total(): number { return this.sumMarks((q: Q) => true) }
  get totalPossible(): number { return this.qs.map(q => q.max()).reduce((sum, qm) => sum += qm, 0) }

  get percent(): number {
    return (this.mode === Modes.Simple ? this.c : this.total) / this.totalPossible * 100
  }
}
