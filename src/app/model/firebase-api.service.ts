import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseAPI {
  private whenOrder = { query: { orderByChild: 'when' } }
  private revwhenOrder = { query: { orderByChild: 'revwhen' } }

  constructor(private afDb: AngularFireDatabase) { }

  objectFirstMap(url: string, fn: (x) => void): Observable<void> {
    return this.afDb.object(url).first().map(x => fn(x))
  }

  listFirstMap(url: string, fn: (x) => void): Observable<void> {
    return this.afDb.list(url, this.whenOrder).first().map(x => fn(x))
  }

  listFirstMapR(url: string, fn: (x) => void): Observable<void> {
    return this.afDb.list(url, this.revwhenOrder).first().map(x => fn(x))
  }

  private promise<T>(fbPromise: firebase.Promise<any>, fn: (x) => T): Promise<T> {
    return new Promise<T>(resolve => {
      fbPromise.then(call => {
        resolve(fn(call))
      }).catch(err => {
        console.log(err)
        resolve(null)
      })
    })
  }

  private promiseBool(fbPromise: firebase.Promise<any>): Promise<boolean> {
    return this.promise<boolean>(fbPromise, (x) => true)
  }

  objectRemoveBool(url: string): Promise<boolean> {
    return this.promiseBool(this.afDb.object(url).remove())
  }

  objectSetBool(url: string, obj: any): Promise<boolean> {
    return this.promiseBool(this.afDb.object(url).set(obj))
  }

  objectUpdate<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    return this.promise<T>(this.afDb.object(url).update(obj), fn)
  }

  objectUpdateBool(url: string, obj: any): Promise<boolean> {
    return this.promiseBool(this.afDb.object(url).update(obj))
  }

  listPush<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    return this.promise<T>(this.afDb.list(url).push(obj), fn)
  }

}
