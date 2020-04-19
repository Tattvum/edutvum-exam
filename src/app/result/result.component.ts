import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../model/exam-result';
import { Lib } from '../model/lib';
import { Tag } from 'app/model/tag';

class MarkStat {
  private _total = 0
  private _omitted = 0
  private _skipped = 0
  private _sure = 0
  private _guess = 0

  public constructor(readonly type: string, readonly name: string) { }

  public addMarks(scored: number, total: number,
    isOmitted: boolean, isAttempted: boolean, isGuess: boolean) {

    this._total += total
    if (isOmitted) this._omitted += total
    else if (!isAttempted) this._skipped += total
    else if (isGuess) this._guess += scored
    else this._sure += scored
    //console.log("tag", this.name, "sure", this._sure, "guess", this._guess)
  }

  public get sure(): number { return this._sure }
  public get guess(): number { return this._guess }
  public get marks(): number { return this.sure + this.guess }
  public get skipped(): number { return this._skipped }
  public get omitted(): number { return this._omitted }
  public get total(): number { return this._total }
  public get totalEffective(): number { return this.total - this.omitted }
  public get marksPercent(): number {
    if (this.totalEffective === 0) return 0;
    else return (this.marks / this.totalEffective) * 100
  }
}

interface MarkStatMap {
  [path: string]: MarkStat
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() result: ExamResult
  chartArray = []

  tagTotal = new MarkStat("", "Total")

  private tags: MarkStatMap = {}

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareChart()
    this.prepareTagChart()
  }

  private prepareChart() {
    let defval = (a, b) => Lib.isNil(a) ? b : a
    this.chartArray = []
    this.result.questions.forEach((q, qid) => {
      let marks = this.result.marks(qid)
      this.chartArray.push({
        value: defval(this.result.durations[qid], 0),
        attempted: defval(this.result.isAttempted(qid), false),
        correct: defval(this.result.isCorrect(qid), false),
        partial: defval(this.result.isPartial(qid), false),
        guess: defval(this.result.guessings[qid], false),
        marks: defval(marks.value, 0),
        max: defval(marks.max, 1),
        action: () => {
          console.log('action', qid)
          this.router.navigate(['/question', this.result.id, qid])
        }
      })
    })
  }

  public get tagStats(): MarkStat[] {
    return Object.keys(this.tags).sort().map(p => this.tags[p])
  }

  private getTagStat(type: string, name: string): MarkStat {
    let key = type + ":" + name
    let ms = this.tags[key]
    if (Lib.isNil(ms)) ms = this.tags[key] = new MarkStat(type, name)
    return ms
  }

  private getTagStatTree(tag: Tag): MarkStat[] {
    let out = []
    let pd = tag.parseData
    tag.paths.forEach(path => out.push(this.getTagStat(pd.type, path)))
    return out
  }

  private prepareTagChart() {
    let defval = (a, b) => Lib.isNil(a) ? b : a

    this.result.questions.forEach((q, qid) => {
      let omitted = defval(this.result.isOmitted(qid), false)
      let attempted = defval(this.result.isAttempted(qid), false)
      let guess = defval(this.result.guessings[qid], false)
      let marks = this.result.marks(qid)

      this.tagTotal.addMarks(marks.value, marks.max, omitted, attempted, guess)
      q.tags.forEach(t => {
        this.getTagStatTree(t).forEach(ms => {
          ms.addMarks(marks.value, marks.max, omitted, attempted, guess)
        })
      })
    })
  }

}
