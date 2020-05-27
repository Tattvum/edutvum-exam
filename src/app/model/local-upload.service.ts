import { Injectable } from "@angular/core";

import "rxjs";
import { map } from "rxjs/operators";

import { DataService, FileLink, UploaderAPI } from "./data.service";

import { Upload } from "./upload";
import { HttpClient, HttpEventType } from "@angular/common/http";

@Injectable()
export class LocalUpload implements UploaderAPI {
  constructor(private service: DataService, private http: HttpClient) {}

  private uploadFiles(upload: Upload) {
    console.log("bingo-start");
    const formData = new FormData();
    console.log("file::", upload.file);
    formData.append("file", upload.file);
    console.log(formData);

    this.http.post<any>("/upload?path=/", formData, {
      reportProgress: true,
      observe: "events",
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: "progress", message: progress };
        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${HttpEventType[event.type]}`;
      }
    })).subscribe(
      (res) => console.log("res:", res),
      (err) => console.log("err:", err),
    );
    console.log("bingo-end");
  }

  public pushUpload(eid: string, qidn: number, upload: Upload) {
    let qid = this.service.getQuestionId(qidn);
    let path = `exams/${eid}/questions/${qid}/files/${upload.file.name}`;
    console.log("TBD..ing: impletement local Upload:", path);
    this.uploadFiles(upload);
  }

  public deleteFileStorage(eid: string, qidn: number, f: FileLink) {
    let qid = this.service.getQuestionId(qidn);
    let path = `exams/${eid}/questions/${qid}/files/${f.file}`;
    console.log("TBD: impletement local delete:", path);
  }
}
