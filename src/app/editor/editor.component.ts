import {
  Component, OnInit, ElementRef, ViewChild, EventEmitter,
  Output, Input, SimpleChanges, OnChanges, Directive
} from '@angular/core';
import { DataService } from 'app/model/data.service';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  @Input() heading = 'Edit Display'
  @Input() content = '[blank]'
  @Output() onedit: EventEmitter<string> = new EventEmitter<string>()

  showPopup = false

  constructor(public service: DataService) { }

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
    this.onedit.emit(this.content);
  }
}
