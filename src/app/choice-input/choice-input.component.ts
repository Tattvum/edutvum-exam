import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StudentService, Exam, Question } from '../model/student.service';

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

  question: Question

  radioItems = 'one two three'.split(' ');
  model = { options: 'two' };
  get debug() { return JSON.stringify(this.model); }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: StudentService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      let qid = params['qid']
      this.question = this.service.getQuestion(eid, qid)
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    })
  }

}
