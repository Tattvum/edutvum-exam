import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StudentService, Exam } from '../model/student.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: StudentService) { }

  exam: Exam

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        if(qid == undefined) qid = 0
        this.exam = this.service.getExam(eid)
        this.exam.select(qid)
      })
  }

  select(i: number) {
    this.router.navigate(['/question', this.exam.id, i])
  }

  next() {
    let qid = this.exam.next()
    if (qid === null) {
      this.router.navigate(
        ['/results', this.exam.id])
    } else this.router.navigate(
      ['/question', this.exam.id, qid])
  }

}
