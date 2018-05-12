import { Injectable } from '@angular/core';

import 'rxjs'
import 'rxjs/add/operator/toPromise';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ThenableReference } from '@firebase/database-types';

@Injectable()
export class FirebaseAPI {
  //NOTE AF5 changes
  //https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
  private order = (child: string) => ref => ref.orderByChild(child)

  constructor(private afDb: AngularFireDatabase) { }

  async objectFirstMap(url: string): Promise<any> {
    return await this.afDb.object(url).valueChanges().first().toPromise()
  }

  async listFirstMapAF5(url: string, child: string): Promise<any> {
    return await this.afDb.list(url, this.order(child)).snapshotChanges().first()
        .map(actions => {
          return actions.map(action => ({ $key: action.key, ...action.payload.val() }));
        }).toPromise()
  }

  async listFirstMap(url: string): Promise<any> {
    return await this.listFirstMapAF5(url, "when")
  }

  async listFirstMapR(url: string): Promise<any> {
    return await this.listFirstMapAF5(url, "revwhen")
  }

  private promise<T>(fbPromise: Promise<any>, fn: (x) => T): Promise<T> {
    return new Promise<T>(resolve => {
      fbPromise.then(call => {
        resolve(fn(call))
      }).catch(err => {
        console.log(err)
        resolve(null)
      })
    })
  }

  private promiseBool(fbPromise: Promise<any>): Promise<boolean> {
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

  //angular-2-and-firebase-throwing-thenablereference-exception-on-form-submit
  //https://stackoverflow.com/a/44426633
  private tr2p(tr: ThenableReference): Promise<any> {
    return new Promise(function (resolve, reject) {
      tr.then(x => resolve(x), x => reject(x));
    });
  }

  listPush<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    //TBD: CHECK 3rd point
    //https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
    return this.promise<T>(this.tr2p(this.afDb.list(url).push(obj)), fn)
  }

}
