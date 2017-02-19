import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StudentService, Exam } from '../model/student.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  exam: Exam

  select(i: number) {
    this.router.navigate(['/question', this.exam.id, i])
  }

  constructor(private route: ActivatedRoute,
      private router: Router,
      private service: StudentService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        this.exam = this.service.getExam(eid)
        this.exam.select(qid)
      })
  }

}
