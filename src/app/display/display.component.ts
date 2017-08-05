import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  @ViewChild('question') question: ElementRef;

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        if (Lib.isNil(eid) || Lib.isNil(qid)) return
        let question = null
        try {
          question = this.service.getQuestion(eid, qid)
        } catch (e) {
          console.log(e)
        }
        if (Lib.isNil(question)) return
        this.question.nativeElement.innerHTML = question.title
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.question.nativeElement]);
      })
  }

}
