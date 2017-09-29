import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { Question } from '../model/question';
import { Lib } from '../model/lib';
import { EMPTY_EXAM_RESULT, ExamResult } from 'app/model/exam-result';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('explanationq') qrefq: ElementRef;
  @ViewChild('explanatione') qrefe: ElementRef;

  qid
  qidshow = ''
  exam: ExamResult = EMPTY_EXAM_RESULT

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.qid = params['qid']
        console.log(eid, this.qid)
        if (Lib.isNil(eid) || Lib.isNil(this.qid)) return
        let question: Question = null
        try {
          question = this.service.getQuestion(eid, this.qid)
        } catch (e) {
          console.log(e)
        }
        if (Lib.isNil(question)) return
        this.exam = this.service.getExam(eid)
        this.qidshow = question.id
        this.setExplanation(question.explanation, this.qrefq.nativeElement)
        this.setExplanation(this.exam.exam.explanation, this.qrefe.nativeElement)
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
      })
  }

  setExplanation(content: string, element: any) {
    element.innerHTML = (content) ? ' <hr> ' + content : ''
  }

}
