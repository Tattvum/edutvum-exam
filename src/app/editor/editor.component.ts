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
  backupContent = ''

  constructor(public service: DataService) { }

  showEdit(event) {
    // if (!event.ctrlKey) return
    if (!(this.service.isAdmin)) return
    this.backupContent = this.content
    this.showPopup = true
    this.service.disableHotkeys = true
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
    if (!(this.service.isAdmin)) return
    this.endEdit()
    this.onedit.emit(this.content);
  }
}
