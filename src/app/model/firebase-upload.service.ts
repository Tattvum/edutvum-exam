import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

import { DataService, FileLink } from './data.service';

import { Upload } from './upload';

import 'firebase/storage';
import { AngularFireAuth } from 'angularfire2/auth';

// https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
@Injectable()
export class FirebaseUpload {

  // https://github.com/angular/angularfire2/issues/1015#issuecomment-323777639
  // 'So even though I don't use auth and db,
  // I still had to include them in the constructor.'
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private service: DataService,
  ) { }

  pushUpload(eid: string, qidn: number, upload: Upload) {
    let qid = this.service.getQuestionId(qidn);
    let storageRef = firebase.storage().ref();
    let path = `exams/${eid}/questions/${qid}/files/${upload.file.name}`
    let uploadTask = storageRef.child(path).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => { // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => console.log(error),
      () => { // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        let fileLink = new FileLink(path, upload.url, upload.name)
        console.log(fileLink)
        this.service.saveFile(qidn, fileLink).then(() => {
          console.log('uploaded and saved!')
        })
      })
  }

  public deleteFileStorage(eid: string, qidn: number, f: FileLink) {
    let qid = this.service.getQuestionId(qidn);
    let storageRef = firebase.storage().ref();
    let path = `exams/${eid}/questions/${qid}/files/${f.file}`
    storageRef.child(path).delete().then(call => {
      console.log('file deleted in storage', f.file)
      this.service.deleteFile(qidn, f.id).then(() => {
        console.log('deleted!')
      })
  })
  }
}
