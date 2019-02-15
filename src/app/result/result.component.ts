import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Data } from '../chart/chart.component';
import { Score } from '../model/score';
import { Lib } from '../model/lib';
import { AnswerType } from '../model/answer-type';
import { Question } from '../model/question';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  results: Score
  report = {
    correct: {
      sure: 0,
      guess: 0,
    },
    wrong: {
      sure: 0,
      guess: 0,
    },
    total: {
      correct: 0,
      wrong: 0,
      sure: 0,
      guess: 0,
      skipped: 0,
      attempted: 0,
      total: 0,
    }
  }

  unit = 0
  unitName = ""

  r3 = {
    q: 0,
    m: 0,
    percent: {
      q: () => this.r3.percentifyQ(this.r3.done.q()),
      m: () => this.r3.percentifyM(this.r3.done.m()),
    },
    left: {
      q: () => this.r3.q - this.r3.done.q(),
      m: () => this.r3.m - Math.abs(this.r3.done.m()),
    },
    done: {
      q: () => this.r3.done.good.q() + this.r3.done.bad.q(),
      m: () => this.r3.done.good.m() + this.r3.done.bad.m(),
      good: {
        q: () => this.r3.done.good.sure.q + this.r3.done.good.guess.q,
        m: () => this.r3.done.good.sure.m + this.r3.done.good.guess.m,
        sure: {
          q: 0,
          m: 0
        },
        guess: {
          q: 0,
          m: 0
        }
      },
      bad: {
        q: () => this.r3.done.bad.sure.q + this.r3.done.bad.guess.q,
        m: () => this.r3.done.bad.sure.m + this.r3.done.bad.guess.m,
        sure: {
          q: 0,
          m: 0
        },
        guess: {
          q: 0,
          m: 0
        }
      },
      sures: {
        q: () => this.r3.done.good.sure.q + this.r3.done.bad.sure.q,
        m: () => this.r3.done.good.sure.m + this.r3.done.bad.sure.m,
      },
      guesses: {
        q: () => this.r3.done.good.guess.q + this.r3.done.bad.guess.q,
        m: () => this.r3.done.good.guess.m + this.r3.done.bad.guess.m,
      }
    },
    percentifyQ: (q) => (q / this.r3.q) * 100,
    percentifyM: (m) => (m / this.r3.m) * 100,
  }

  public array = []

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      let exam = this.service.getExam(eid)
      this.results = null
      if (Lib.isNil(exam)) return
      this.exam = exam
      this.results = this.exam.score()
      this.computeOld()
      this.compute(exam)
      this.prepare()
      this.changeUnit()
    })
  }

  correctSure = 0
  correctGuess = 0
  correctTotal = 0
  wrongSure = 0
  wrongGuess = 0
  wrongTotal = 0
  sureTotal = 0
  guessTotal =0
  total = 0
  percent = 0
  maxTotal = 0
  skipped = 0

  changeUnit() {
    //WARNING: This + is required!!
    let pcent = (m) => (m / this.r3.m) * 100
    switch(+this.unit) {
      case 0: {
        this.correctSure = this.r3.done.good.sure.q
        this.correctGuess = this.r3.done.good.guess.q
        this.correctTotal = this.r3.done.good.q()
        this.wrongSure = this.r3.done.bad.sure.q
        this.wrongGuess = this.r3.done.bad.guess.q
        this.wrongTotal = this.r3.done.bad.q()
        this.sureTotal = this.r3.done.sures.q()
        this.guessTotal = this.r3.done.guesses.q()
        this.total = this.r3.done.q()
        this.percent = (this.r3.done.good.q() / this.r3.q) * 100
        this.maxTotal = this.r3.q
        this.skipped = this.r3.left.q()
        this.unitName = "Questions"
        break
      }
      case 1: {
        this.correctSure = this.r3.done.good.sure.m
        this.correctGuess = this.r3.done.good.guess.m
        this.correctTotal = this.r3.done.good.m()
        this.wrongSure = this.r3.done.bad.sure.m
        this.wrongGuess = this.r3.done.bad.guess.m
        this.wrongTotal = this.r3.done.bad.m()
        this.sureTotal = this.r3.done.sures.m()
        this.guessTotal = this.r3.done.guesses.m()
        this.total = this.r3.done.m()
        this.percent = (this.r3.done.m() / this.r3.m) * 100
        this.maxTotal = this.r3.m
        this.skipped = this.r3.left.m()
        this.unitName = "Marks"
        break;
      }
      case 2: {
        this.correctSure = pcent(this.r3.done.good.sure.m)
        this.correctGuess = pcent(this.r3.done.good.guess.m)
        this.correctTotal = pcent(this.r3.done.good.m())
        this.wrongSure = pcent(this.r3.done.bad.sure.m)
        this.wrongGuess = pcent(this.r3.done.bad.guess.m)
        this.wrongTotal = pcent(this.r3.done.bad.m())
        this.sureTotal = pcent(this.r3.done.sures.m())
        this.guessTotal = pcent(this.r3.done.guesses.m())
        this.total = pcent(this.r3.done.m())
        this.percent = (this.r3.done.m() / this.r3.m) * 100
        this.maxTotal = 100
        this.skipped = pcent(this.r3.left.m())
        this.unitName = "Percentage %"
        break;
      }
    }
  }

  private maxMarks(q: Question): number {
    //ASSERT 4 chouces exactly!!
    if (q.type === AnswerType.MAQ) return +4
    else return +3
  }

  private markNSE_IIT(ex: ExamResult, qid: number): number {
    let q = ex.questions[qid]
    let sols = ex.questions[qid].solutions
    let anss = ex.answers[qid]
    if (!ex.isAttempted(qid)) return 0
    //ASSERT 4 choices exactly!!
    if (q.type !== AnswerType.MAQ) return ex.isCorrect(qid) ? +3 : -1
    //ASSERT answers are non-duplicated
    let m = 0
    for (let a of anss) if (!sols.includes(a)) m++
    if (anss.length === sols.length && anss.length === m) return +4
    else if (m < sols.length) return m
    else if (m < anss.length) return -2
  }

  private compute(ex: ExamResult) {
    this.r3.q = ex.questions.length
    ex.questions.forEach((q, qid) => {
      let m = this.markNSE_IIT(ex, qid)
      let g = ex.guessings[qid]
      this.r3.m += this.maxMarks(ex.questions[qid])
      if (m === 0) return
      if (m > 0) {
        if (g) {
          this.r3.done.good.guess.q++
          this.r3.done.good.guess.m += m
        } else {
          this.r3.done.good.sure.q++
          this.r3.done.good.sure.m += m
        }
      }
      if (m < 0) {
        if (g) {
          this.r3.done.bad.guess.q++
          this.r3.done.bad.guess.m += m
        } else {
          this.r3.done.bad.sure.q++
          this.r3.done.bad.sure.m += m
        }
      }
    })
  }

  private computeOld() {
    this.exam.answers.forEach((ans, qid) => {
      if (ans !== undefined) {
        if (this.exam.isAttempted(qid)) {
          this.report.total.attempted++
          if (this.exam.isCorrect(qid)) {
            this.report.total.correct++
            if (this.exam.guessings[qid]) {
              this.report.correct.guess++
              this.report.total.guess++
            } else {
              this.report.correct.sure++
              this.report.total.sure++
            }
          } else {
            this.report.total.wrong++
            if (this.exam.guessings[qid]) {
              this.report.wrong.guess++
              this.report.total.guess++
            } else {
              this.report.wrong.sure++
              this.report.total.sure++
            }
          }
        } else this.report.total.skipped++
      }
    })
    let total = this.report.total.total = this.exam.questions.length
    this.report.total.skipped = total - this.report.total.attempted
  }

  private defval(a, b) {
    return Lib.isNil(a) ? b : a
  }

  private prepare() {
    this.array = []
    this.exam.questions.forEach((q, qid) => {
      let d = this.exam.durations[qid]
      this.array.push({
        value: this.defval(this.exam.durations[qid], 0),
        attempted: this.defval(this.exam.isAttempted(qid), false),
        correct: this.defval(this.exam.isCorrect(qid), false),
        guess: this.defval(this.exam.guessings[qid], false),
        action: () => {
          console.log('action', qid)
          this.router.navigate(['/question', this.exam.id, qid])
        }
      })
    })
  }

}
