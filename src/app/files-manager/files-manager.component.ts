import { Component, Input } from '@angular/core';
import { FileLink, UploaderAPI } from 'app/model/data.service';
import { GeneralContext } from 'app/model/general-context';
import { Upload } from 'app/model/upload';
import { Lib } from 'app/model/lib';

@Component({
  selector: 'app-files-manager',
  templateUrl: './files-manager.component.html',
  styleUrls: ['./files-manager.component.scss']
})
export class FilesManagerComponent {

  @Input() files: FileLink[]
  @Input() qidn: number
  @Input() eid: string

  selectedFiles: FileList;
  currentUpload: Upload;

  constructor(private generalContext: GeneralContext,
    private uploader: UploaderAPI) { }

  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
    Lib.range(this.selectedFiles.length).forEach(i => {
      this.currentUpload = new Upload(this.selectedFiles.item(i));
      this.uploader.pushUpload(this.eid, this.qidn, this.currentUpload)
    })
  }

  copyUrlToClipboard(f: FileLink, event) {
    let selectbox = event.target.parentNode.querySelector('.selectbox')
    selectbox.select()
    document.execCommand('Copy')
    console.log('copied', f.url)
  }

  removeFile(f: FileLink) {
    if (this.generalContext.confirm(`Delete the file: ${f.file}. Sure?!
      \n Please ensure that your existing tags are not using it.`)) {
      console.log(f.id)
      this.uploader.deleteFileStorage(this.eid, this.qidn, f)
    }
  }

}
