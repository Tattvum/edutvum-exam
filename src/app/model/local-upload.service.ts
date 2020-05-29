import { Injectable } from "@angular/core";

import "rxjs";
import { map } from "rxjs/operators";

import { DataService, FileLink, UploaderAPI } from "./data.service";

import { Upload } from "./upload";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { Lib } from "./lib";

@Injectable()
export class LocalUpload implements UploaderAPI {
  constructor(private service: DataService, private http: HttpClient) { }

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

  dtFileFullPath(dt: Date, fileName: string): string {
    const month = Lib.n2s(dt.getUTCMonth() + 1) //months from 1-12
    const day = Lib.n2s(dt.getUTCDate())
    const year = dt.getUTCFullYear()
    const dtiso = Lib.dtstrISO(dt)
    return year + "/" + month + "/" + day + "/" + dtiso + '-' + fileName;
  }

  public async uploadUrl(upload: Upload): Promise<string> {
    const fullname = this.dtFileFullPath(new Date(), upload.file.name)
    console.log("TBD..ing: impletement local Upload:", fullname);
    this.uploadFiles(upload);
    return ""
  }

  public async deleteFileStorage(eid: string, qidn: number, f: FileLink): Promise<boolean> {
    let qid = this.service.getQuestionId(qidn);
    let path = `exams/${eid}/questions/${qid}/files/${f.file}`;
    console.log("TBD: impletement local delete:", path);
    return true
  }
}
