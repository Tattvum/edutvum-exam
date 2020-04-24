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
  qidn: number = -1
  question: Question
  sidn: number

  mainResult: ExamResult

  constructor(private route: ActivatedRoute, private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      //console.log("ExamComponent", params)
      let rid = params['rid']
      if (Lib.isNil(rid)) return
      this.mainResult = this.service.getExam(rid)
      this.result = this.mainResult
      this.isLocked = this.result.isLocked()
      this.isResultsPage = true

      let qid = params['qid']
      if (Lib.isNil(qid)) return
      this.setQuestion(+qid)

      let sid = params['sid']
      if (Lib.isNil(sid)) return
      this.setSnapshot(+sid)
    })
  }

  setSnapshot(i: number) {
    if (!this.mainResult.isLocked()) return
    this.sidn = i
    if (this.sidn < 0) this.result = this.mainResult
    else this.result = this.snapshots[i]
    this.setQuestion(this.qidn)
  }

  public get snapshots(): ExamResult[] {
    return this.service.getResultSnapshots(this.mainResult.id)
  }

  get isPending(): boolean {
    return this.result.exam.status === ExamStatus.PENDING && this.service.isAdmin
  }

  setQuestion(qidn: number) {
    this.qidn = qidn
    this.isResultsPage = qidn < 0
    if (this.isResultsPage) return

    this.question = this.service.getQuestion(this.result.id, this.qidn + "")
    //console.log(this.mainResult.id, this.sidn, this.result.id, this.qidn)

    // if (this.isResultsPage) this.router.navigate(['/results', this.mainResult.id])
    // else {
    //   this.question = this.service.getQuestion(this.result.id, this.qidn + "")
    //   this.router.navigate(['/question', this.mainResult.id, qidn])
    // }
  }
}
