import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  isResultsPage = false
  qidn: number

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.exam = EMPTY_EXAM_RESULT
        this.isResultsPage = false
        this.qidn = -1
        let eid = params['eid']
        let exam = this.service.getExam(eid)
        if (Lib.isNil(exam)) return
        this.exam = exam
        let qid = params['qid']
        this.isResultsPage = (Lib.isNil(qid))
        if (this.isResultsPage) return
        this.qidn = +qid
        this.isResultsPage = false
      })
  }

  next() {
    let qid = this.exam.nextq(this.qidn)
    if (qid == null) this.results()
    else this.select(+qid)
  }

  select(qid: number) {
    this.router.navigate(['/question', this.exam.id, qid])
  }

  results() {
    if (Lib.isNil(this.exam)) return
    if (!this.exam.isLocked()) {
      if (!confirm('Done with the exam?!')) return
      this.exam = this.service.saveExam()
    }
    this.router.navigate(['/results', this.exam.id])
  }

  gotoDash() {
    if (!this.exam.isLocked() && !confirm('Cancel the exam: Sure?!')) return
    this.router.navigate(['/student-dash'])
  }
}
