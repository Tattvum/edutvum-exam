import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { DataService } from 'app/model/data.service';
import { Lib } from '../model/lib';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('display') qref: ElementRef;

  @Input() title = 'Edit Display'
  @Input() content = '[blank]'
  @Output() onedit: EventEmitter<string> = new EventEmitter<string>()

  showPopup = false

  constructor(private service: DataService) { }

  ngOnInit() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.qref.nativeElement]);
  }

  showEdit(event) {
    // if (!event.ctrlKey) return
    if (!(this.service.isAdmin)) return
    this.showPopup = true
    this.service.disableHotkeys = true
  }

  closeEdit() {
    this.showPopup = false
    this.service.disableHotkeys = false
  }

  edit() {
    if (!(this.service.isAdmin)) return
    this.closeEdit()
    // console.log(this.question.id, this.qshow)
    this.qref.nativeElement.innerHTML = this.content
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.qref.nativeElement]);
    this.onedit.emit(this.content);
  }
}
