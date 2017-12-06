import { Injectable } from '@angular/core';

import 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseAPI {
  private whenOrder = { query: { orderByChild: 'when' } }
  private revwhenOrder = { query: { orderByChild: 'revwhen' } }

  constructor(private afDb: AngularFireDatabase) { }

  async objectFirstMap(url: string): Promise<any> {
    return await this.afDb.object(url).first().toPromise()
  }

  async listFirstMap(url: string): Promise<any> {
    return await this.afDb.list(url, this.whenOrder).first().toPromise()
  }

  async listFirstMapR(url: string): Promise<any> {
    return await this.afDb.list(url, this.revwhenOrder).first().toPromise()
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
