import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService, ExamEditType } from '../model/data.service';
import { Question } from '../model/question';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  qid
  question: Question

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.qid = params['qid']
        this.question = this.service.getQuestion(eid, this.qid)
      })
  }

  onEdit(newtext) {
    this.question.title = newtext
    this.service.editQuestionDisplay(newtext, this.qid)
  }

}
