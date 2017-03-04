import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService, Exam, Question } from '../model/data.service';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-choice-input',
  templateUrl: './choice-input.component.html',
  styleUrls: ['./choice-input.component.css']
})
export class ChoiceInputComponent implements OnInit {

  exam: Exam
  question: Question

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      let qid = params['qid']
      this.exam = this.service.getExam(eid)
      this.question = this.service.getQuestion(eid, qid)
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    })
  }

}
