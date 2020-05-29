import {
  Component, OnInit, ElementRef, ViewChild, EventEmitter,
  Output, Input, SimpleChanges, OnChanges, Directive
} from '@angular/core';
import { DataService, UploaderAPI } from 'app/model/data.service';
import { Lib } from '../model/lib';
import { Upload } from 'app/model/upload';

function stripPIfSingle(txt: string): string {
  if (txt.indexOf('<p>', 3) < 0) {
    txt = txt.trim()
    if (txt.startsWith('<p>')) txt = txt.slice(3)
    if (txt.endsWith('</p>')) txt = txt.slice(0, txt.length - 4)
  }
  return txt
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  @Input() heading = 'Edit Display'
  @Input() safe: boolean = false
  @Output() onedit: EventEmitter<string> = new EventEmitter<string>()
  @Input() content: string = '[blank]'

  @ViewChild('textbox', { static: true }) private textbox: ElementRef;

  showPopup = false
  backupContent = ''
  quillEditorRef;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],         // toggled buttons

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

      [{ 'color': [] }, { 'background': [] }],           // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video'],                        // link and image, video
    ]
  }

  constructor(public service: DataService, private uploader: UploaderAPI) { }

  private ok(): boolean {
    return this.service.isAdmin || this.safe
  }

  showEdit(event) {
    // if (!event.ctrlKey) return
    if (!this.ok) return
    this.backupContent = this.content
    this.showPopup = true
    this.service.disableHotkeys = true
    // https://stackoverflow.com/questions/38307060/how-to-set-focus-on-element-with-binding
    // https://stackoverflow.com/a/45306425/6205090
    // setTimeout(() => {
    //   this.textbox.nativeElement.focus()
    //   this.textbox.nativeElement.select()
    // }, 10);
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
    if (!this.ok) return
    this.endEdit()
    this.onedit.emit(stripPIfSingle(this.content));
  }

  onEditorCreated(editorInstance: any) {
    editorInstance.focus()
    editorInstance.setSelection(0, 5);
    const imageHandler = (image: any, callback: any) => {
      this.pickUploadSaveUrl(this.quillEditorRef.getSelection(true).index)
    }
    this.quillEditorRef = editorInstance
    const toolbar = editorInstance.getModule('toolbar')
    toolbar.addHandler('image', imageHandler.bind(this))
  }

  pickUploadSaveUrl(loc: number) {
    const Imageinput = document.createElement('input');
    Imageinput.setAttribute('type', 'file')
    Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    Imageinput.classList.add('ql-image')

    Imageinput.addEventListener('change', async () => {
      const file = Imageinput.files[0]
      if (Imageinput.files == null || Imageinput.files[0] == null) return
      const url = await this.uploader.uploadUrl(new Upload(file))
      //NOTE: assuming loc has not changed after upload starting.
      this.quillEditorRef.insertEmbed(loc, 'image', url, 'user');
    })

    Imageinput.click();
  }

}
