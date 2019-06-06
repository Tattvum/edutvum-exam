import {
  Component, OnInit, ElementRef, ViewChild, EventEmitter,
  Output, Input, SimpleChanges, OnChanges, Directive
} from '@angular/core';
import { DataService } from 'app/model/data.service';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-editor1',
  templateUrl: './editor1.component.html',
  styleUrls: ['./editor1.component.scss']
})
export class Editor1Component {

  @Input() heading = 'Edit Display'
  @Input() content = '[blank]'
  @Output() onedit: EventEmitter<string> = new EventEmitter<string>()

  @ViewChild('textbox', { static: true }) private textbox: ElementRef;

  showPopup = false
  backupContent = ''

  constructor(public service: DataService) { }

  showEdit(event) {
    // if (!event.ctrlKey) return
    this.backupContent = this.content
    this.showPopup = true
    this.service.disableHotkeys = true
    // https://stackoverflow.com/questions/38307060/how-to-set-focus-on-element-with-binding
    // https://stackoverflow.com/a/45306425/6205090
    setTimeout(() => {
      this.textbox.nativeElement.focus()
      this.textbox.nativeElement.select()
    }, 10);
  }

  private endEdit() {
    this.showPopup = false
    this.service.disableHotkeys = false
  }

  closeEdit() {
    this.content = this.backupContent
    this.endEdit()
  }

  edit() {
    this.endEdit()
    this.onedit.emit(this.content);
  }
}
