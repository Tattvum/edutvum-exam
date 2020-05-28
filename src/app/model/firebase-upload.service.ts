import { Injectable } from '@angular/core';
import 'rxjs'
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataService, FileLink, UploaderAPI } from './data.service';
import { Upload } from './upload';
import 'firebase/storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FirebaseUpload implements UploaderAPI {

  // https://github.com/angular/angularfire2/issues/1015#issuecomment-323777639
  // 'So even though I don't use auth and db,
  // I still had to include them in the constructor.'
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private service: DataService,
  ) { }

  doUpload(uploadTask: firebase.storage.UploadTask): Promise<void> {
    return new Promise((accept, reject) => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
        'next': snap => console.log((snap.bytesTransferred / snap.totalBytes) * 100),
        'error': reject,
        'complete': accept,
      })
    })
  }

  public async pushUpload(eid: string, qidn: number, upload: Upload): Promise<string> {
    let qid = this.service.getQuestionId(qidn)
    let storageRef = firebase.storage().ref()
    let path = `exams/${eid}/questions/${qid}/files/${upload.file.name}`
    let uploadTask = storageRef.child(path).put(upload.file)

    await this.doUpload(uploadTask)
    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
    upload.name = upload.file.name
    let fileLink = new FileLink(path, downloadURL, upload.name)
    console.log(fileLink)
    await this.service.saveFile(qidn, fileLink)
    console.log('uploaded and saved!')
    return downloadURL
  }

  public async deleteFileStorage(eid: string, qidn: number, f: FileLink): Promise<boolean> {
    let qid = this.service.getQuestionId(qidn)
    let storageRef = firebase.storage().ref()
    let path = `exams/${eid}/questions/${qid}/files/${f.file}`
    await storageRef.child(path).delete()
    console.log('file deleted in storage', f.file)
    await this.service.deleteFile(qidn, f.id)
    console.log('deleted in db too!')
    return true
  }
}
