import { Injectable } from '@angular/core';
import { Storage, UploadTask, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { DataService, FileLink, UploaderAPI, UploadContext } from './data.service';
import { Upload } from './upload';
import { Lib } from './lib';

@Injectable()
export class FirebaseUpload implements UploaderAPI {

  private context: UploadContext

  // https://github.com/angular/angularfire2/issues/1015#issuecomment-323777639
  // 'So even though I don't use auth and db,
  // I still had to include them in the constructor.'
  constructor(
    private storage: Storage,
    service: DataService,
  ) {
    this.context = service
  }

  oldpath(eid: string, qid: string, name: string): string {
    return `exams/${eid}/questions/${qid}/files/${name}`
  }

  doUpload(uploadTask: UploadTask): Promise<void> {
    return new Promise((accept, reject) => {
      uploadTask.on("state_changed", {
        'next': snap => console.log((snap.bytesTransferred / snap.totalBytes) * 100),
        'error': reject,
        'complete': accept,
      })
    })
  }

  private async uploadUrlInternal(fullname: string, upload: Upload): Promise<string> {
    const storageRef = ref(this.storage, fullname)
    // const uploadTask = storageRef.child(fullname).put(upload.file)
    const uploadTask = uploadBytesResumable(storageRef, upload.file)

    await this.doUpload(uploadTask)
    // const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
    const downloadURL = await getDownloadURL(storageRef)
    console.log('fullname:', fullname, 'downloadURL:', downloadURL)
    return downloadURL
  }

  dtFileFullPath(dt: Date, fileName: string): string {
    const month = Lib.n2s(dt.getUTCMonth() + 1) //months from 1-12
    const day = Lib.n2s(dt.getUTCDate())
    const year = dt.getUTCFullYear()
    const dtiso = Lib.dtstrISO(dt)
    return year + "/" + month + "/" + day + "/" + dtiso + '-' + fileName;
  }

  public async uploadUrl(upload: Upload): Promise<string> {
    const fullname = this.dtFileFullPath(new Date(), upload.file.name)
    return await this.uploadUrlInternal(fullname, upload)
  }

  // public async pushUpload(eid: string, qidn: number, upload: Upload): Promise<string> {
  //   const qid = this.context.getQuestionId(qidn)
  //   const fullname = this.oldpath(eid, qid, upload.file.name)
  //   const downloadURL = await this.uploadUrlInternal(fullname, upload)
  //   upload.name = upload.file.name
  //   let fileLink = new FileLink(path, downloadURL, upload.name)
  //   console.log(fileLink)

  //   await this.context.saveFile(qidn, fileLink)
  //   console.log('uploaded and saved!')
  //   return downloadURL
  // }

  // public async deleteFileStorage(eid: string, qidn: number, f: FileLink): Promise<boolean> {
  //   const qid = this.context.getQuestionId(qidn)
  //   const fullname = this.path(eid, qid, f.file)
  //   const storageRef = firebase.storage().ref()

  //   await storageRef.child(fullname).delete()
  //   console.log('file deleted in storage', f.file)

  //   await this.context.deleteFile(qidn, f.id)
  //   console.log('deleted in db too!')
  //   return true
  // }
}
