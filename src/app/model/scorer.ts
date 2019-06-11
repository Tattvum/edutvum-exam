import { AnswerType } from './answer-type'
import { Question } from './question'
import { ExamResult } from './exam-result';

interface Q {
  guessed(): boolean
  status(): number // +1 correct, 0 skipped, -1 wrong
  marks(): number
  max(): number
  omitted(): boolean
}

function asQArr_Simple(ex: ExamResult): Q[] {
  return ex.questions.map((_, qid) => {
    return {
      "guessed": () => ex.guessings[qid],
      "status": () => ex.isAttempted(qid) ? ex.isCorrect(qid) ? +1 : -1 : 0,
      "marks": () => ex.isAttempted(qid) ? 1 : 0,
      "max": () => 1,
      "omitted": () => ex.isOmitted(qid),
    }
  })
}

function asQArr_Percent(ex: ExamResult): Q[] {
  let count = ex.questions.filter((_, qid) => !ex.isOmitted(qid)).length
  let qpercent = 100 / count
  return ex.questions.map((_, qid) => {
    return {
      "guessed": () => ex.guessings[qid],
      "status": () => ex.isAttempted(qid) ? ex.isCorrect(qid) ? +1 : -1 : 0,
      "marks": () => ex.isAttempted(qid) ? qpercent : 0,
      "max": () => qpercent,
      "omitted": () => ex.isOmitted(qid),
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
      "omitted": () => ex.isOmitted(qid),
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
    this.qs = this.q1 //default
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
    return this.qs
      .filter(q => !q.omitted())
      .filter((q: Q) => q.status() === 0)
      .map(q => q.max())
      .reduce((sum, qm) => sum += qm, 0)
  }

  get omitted(): number {
    return this.qs.filter(q => q.omitted()).length
  }

  private sumMarks(condition: (q: Q) => boolean): number {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Reduce_of_empty_array_with_no_initial_value
    return this.qs
      .filter(q => !q.omitted())
      .filter(condition)
      .map(q => q.marks())
      .reduce((sum, qm) => sum += qm, 0)
  }

  get cs(): number { return this.sumMarks((q: Q) => !q.guessed() && q.status() > 0) }
  get cg(): number { return this.sumMarks((q: Q) => q.guessed() && q.status() > 0) }
  get ws(): number { return this.sumMarks((q: Q) => !q.guessed() && q.status() < 0) }
  get wg(): number { return this.sumMarks((q: Q) => q.guessed() && q.status() < 0) }

  get c(): number { return this.sumMarks((q: Q) => q.status() > 0) }
  get w(): number { return this.sumMarks((q: Q) => q.status() < 0) }
  get s(): number { return this.sumMarks((q: Q) => !q.guessed()) }
  get g(): number { return this.sumMarks((q: Q) => q.guessed()) }

  get totalPossible(): number {
    switch (this.mode) {
      case Modes.Simple:
      case Modes.JEE: return this.qs.filter(q => !q.omitted())
        .map(q => q.max()).reduce((sum, qm) => sum += qm, 0)
      case Modes.Percent: return 100
    }
    return
  }

  get total(): number {
    switch (this.mode) {
      case Modes.Simple: return this.c
      case Modes.JEE: return this.sumMarks((q: Q) => true)
      case Modes.Percent: return this.c
    }
  }

  get percent(): number {
    return (this.total / this.totalPossible) * 100
  }
}
