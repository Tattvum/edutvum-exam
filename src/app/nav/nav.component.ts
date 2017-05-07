import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService, Exam } from '../model/data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  exam: Exam
  isResultsPage = false

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.exam = this.service.getExam(eid)
        let qid = params['qid']
        console.log('NEW NAV', eid, qid, this.exam)
        this.isResultsPage = (qid == null)
        if (!this.isResultsPage) this.exam.select(qid)
      })
  }

  select(qid: number) {
    this.exam.select(qid)
    this.router.navigate(['/question', this.exam.id, qid])
  }

  results() {
    if (!this.exam.inAnswerMode) {
      if (!confirm("Done with the exam?!")) return
      this.exam.inAnswerMode = true
      this.exam = this.service.saveExam(this.exam)
    }
    this.exam.selectNone()
    this.router.navigate(['/results', this.exam.id])
  }

  next() {
    let qid = this.exam.next()
    if (qid == null) this.results()
    else this.select(qid)
  }

}
