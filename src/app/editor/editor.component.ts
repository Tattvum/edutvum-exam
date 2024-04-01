import { Component, ViewChild, EventEmitter, Output, Input, TemplateRef, HostListener, OnInit } from '@angular/core'
import { DataService, UploaderAPI } from '../model/data.service'
import { Upload } from '../model/upload'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { MatTabsModule } from '@angular/material/tabs'
import { QuillModule } from 'ngx-quill'
import { FormsModule } from '@angular/forms'
import { MathJaxDirective } from '../mathjax.directive'

//NOTE: Since the Quill component adds a p tag on any edit
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
  standalone: true,
  imports: [
    MatTabsModule, QuillModule, FormsModule, MatDialogModule, MathJaxDirective,
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input() heading = 'Edit Display'
  @Input() safe: boolean = false
  @Output() onedit: EventEmitter<string> = new EventEmitter<string>()
  @Input() content: string = '[blank]'

  @ViewChild('popup') popupTemplate: TemplateRef<any>

  showPopup = false
  backupContent = ''
  quillEditorRef;
  innerHeight: number
  innerWidth: number

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

  constructor(public service: DataService,
    private dialog: MatDialog, private overlay: Overlay, private uploader: UploaderAPI) { }

  recordWindowInnerSizes() {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    // console.log(this.innerHeight, this.innerWidth)
  }

  ngOnInit() {
    this.recordWindowInnerSizes()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recordWindowInnerSizes()
  }

  doPopup(): void {
    if (!this.service.isAdmin && !this.safe) return
    this.backupContent = this.content
    this.service.disableHotkeys = true
    const dialogRef = this.dialog.open(this.popupTemplate, {
      width: '600px',
      maxHeight: this.innerHeight - 50,
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    dialogRef.afterClosed().subscribe(save => {
      this.service.disableHotkeys = false
      if (save) this.onedit.emit(stripPIfSingle(this.content))
      else this.content = this.backupContent
    });
  }

  //------------------------------------------------------------------------------

  onEditorCreated(editorInstance: any) {
    editorInstance.focus()
    const isSmall = this.content.length <= 32
    if (isSmall) editorInstance.setSelection(0, editorInstance.getLength(), 'user');
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
