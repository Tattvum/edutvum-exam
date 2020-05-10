
import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractFirebaseAPI } from './firebase-data-source.service';

//svr@tnr:~/lindata/edutvum/edutvum-exam$ firebase emulators:start --only database
//...
//i  database: For testing set FIREBASE_DATABASE_EMULATOR_HOST=localhost:9000
//✔  emulators: All emulators started, it is now safe to connect.
//const HOST = "http://localhost:9000/"

//Take snapshot...
//svr@tnr:~/lindata/edutvum/edutvum-exam$ curl http://localhost:9000/-M6wbpXMXJhX4abL9CQo.json > edutvum-exam-export-dev.json
//https://serverfault.com/questions/196734/bash-difference-between-and-operator
//"The > overwrites the file if it exists or creates it if it doesn't exist."

//svr@tnr:~/lindata/edutvum/edutvum-exam$ curl -X POST -d @edutvum-exam-export-dev.json  http://localhost:9000/.json
//{ "name": "-M6wbpXMXJhX4abL9CQo" }
//const DB = "-M6wbpXMXJhX4abL9CQo"

function cmpWhen(a, b) {
  if (a.when < b.when) return -1;
  if (a.when > b.when) return 1;
  return 0;
}

function cmpRevWhen(a, b) {
  if (a.revwhen < b.revwhen) return -1;
  if (a.revwhen > b.revwhen) return 1;
  return 0;
}

function pr2pr<T>(pr: Promise<any>, fn: (x) => T): Promise<T> {
  return new Promise<T>(resolve => {
    pr.then(x => resolve(fn(x))).catch(err => {
      console.log(err)
      resolve(null)
    })
  })
}

function promiseBool(pr: Promise<any>): Promise<boolean> {
  return pr2pr<boolean>(pr, (x) => true)
}

function pr2pr2<T>(pr: Promise<any>, fn: (x) => T): Promise<T> {
  return new Promise<T>(resolve => {
    pr.then(x => {
      console.log(x)
      x.key = x.name
      resolve(fn(x))
    }).catch(err => {
      console.log(err)
      resolve(null)
    })
  })
}

function stringify(obj: any): string {
  let str = JSON.stringify(obj)
  console.log(str)
  return str
}

export interface EmulatorConfig {
  HOST: string;
  DB: string;
}
export const EMULATOR_CONFIG = new InjectionToken<EmulatorConfig>('Emulator Config');

//https://github.com/firebase/firebase-tools/issues/1485
//https://github.com/firebase/firebase-admin-node/pull/589
//https://github.com/angular/angularfire
//https://github.com/firebase/firebase-tools/issues/1485 (IMPORTANT: REST API)

@Injectable()
export class LocalFirebaseAPI implements AbstractFirebaseAPI {

  constructor(@Inject(EMULATOR_CONFIG) private config: EmulatorConfig, private http: HttpClient) { }

  private emurl(url: string): string {
    let out = this.config.HOST + this.config.DB + "/" + url + ".json"
    console.log(out)
    return out
  }

  async objectFirstMap(url: string): Promise<any> {
    //return await this.lafDb.object(url).valueChanges().pipe(first()).toPromise()
    let arr = await this.http.get(this.emurl(url)).toPromise()
    if (!arr) arr = []
    return arr
  }

  async listFirstMap(url: string): Promise<any> {
    // return await this.listFirstMapAF5(url, "when")
    let obj = await this.http.get(this.emurl(url)).toPromise()
    let arr = []
    if (obj) {
      arr = Object.keys(obj).map(k => ({ $key: k, ...obj[k] }))
    }
    if (!arr) arr = []
    return arr.sort(cmpWhen)
  }

  async listFirstMapR(url: string): Promise<any> {
    // return await this.listFirstMapAF5(url, "revwhen")
    let obj = await this.http.get(this.emurl(url)).toPromise()
    let arr = []
    if (obj) {
      arr = Object.keys(obj).map(k => ({ $key: k, ...obj[k] }))
    }
    if (!arr) arr = []
    return arr.sort(cmpRevWhen)
  }

  async objectRemoveBool(url: string): Promise<boolean> {
    // return this.promiseBool(this.lafDb.object(url).remove())
    let pr = this.http.delete(this.emurl(url)).toPromise()
    return promiseBool(pr)
  }

  async objectSetBool(url: string, obj: any): Promise<boolean> {
    // return this.promiseBool(this.lafDb.object(url).set(obj))
    let pr = this.http.put(this.emurl(url), stringify(obj)).toPromise()
    return promiseBool(pr)
  }

  async objectUpdate<T>(url: string, objcover: any, fn: (x) => T): Promise<T> {
    // return this.promise<T>(this.lafDb.object(url).update(obj), fn)
    let id = Object.keys(objcover)[0]
    let obj = objcover[id]
    console.log("objectUpdate<T>", id, stringify(Object.keys(obj)))
    let pr = this.http.put(this.emurl(url + id + "/"), stringify(obj)).toPromise()
    return pr2pr<T>(pr, fn)
  }

  async objectUpdateBool(url: string, obj: any): Promise<boolean> {
    // return this.promiseBool(this.lafDb.object(url).update(obj))
    let pr = this.http.put(this.emurl(url), stringify(obj)).toPromise()
    return promiseBool(pr)
  }

  async listPush<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    // return this.pr2pr<T>(this.tr2p(this.lafDb.list(url).push(obj)), fn)
    let pr = this.http.post(this.emurl(url), stringify(obj)).toPromise()
    return pr2pr2<T>(pr, fn)
  }

}
