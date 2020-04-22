import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';
import { EMPTY_EXAM_RESULT, ExamResult } from 'app/model/exam-result';
import { Question } from 'app/model/question';
import { ExamStatus } from 'app/model/exam';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  isResultsPage = true
  isLocked = true
  result: ExamResult
  qid: string
  qidn: number = -1
  question: Question
  sidn: number

  mainResult: ExamResult

  constructor(private route: ActivatedRoute, private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log("ExamComponent", params)
      let rid = params['rid']
      if (Lib.isNil(rid)) return
      this.mainResult = this.service.getExam(rid)
      this.result = this.mainResult
      this.isLocked = this.result.isLocked()

      // let sid = params['sid']
      // if (Lib.isNil(sid)) return
      // this.showSnapshot(+sid)

      this.qid = params['qid']
      if (Lib.isNil(this.qid)) return
      this.isResultsPage = false
      this.qidn = +this.qid
      this.question = this.service.getQuestion(rid, this.qid)
    })
  }

  showSnapshot(i: number) {
    if (!this.mainResult.isLocked()) return
    this.sidn = i
    this.result = this.snapshots[i]
  }

  public get snapshots(): ExamResult[] {
    return this.service.getResultSnapshots(this.mainResult.id)
  }

  get isPending(): boolean {
    return this.result.exam.status === ExamStatus.PENDING && this.service.isAdmin
  }

  questionChanged(qidn: number) {
    console.log("questionChanged:", qidn)
    this.qidn = qidn
    this.isResultsPage = qidn < 0
    console.log(this.mainResult.id, this.sidn, this.result.id, this.qid, qidn)
    if (this.isResultsPage) this.router.navigate(['/results', this.mainResult.id])
    else {
      this.question = this.service.getQuestion(this.result.id, this.qid)
      this.router.navigate(['/question', this.mainResult.id, qidn])
    }
  }
}
