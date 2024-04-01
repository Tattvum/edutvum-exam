
import { map, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Database, object } from '@angular/fire/database';

import { AbstractFirebaseAPI } from './firebase-data-source.service';

@Injectable()
export class FirebaseAPI implements AbstractFirebaseAPI {
  //NOTE AF5 changes
  //https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
  private order = (child: string) => ref => ref.orderByChild(child)

  constructor(private db: AngularFireDatabase) { }

  async objectFirstMap(url: string): Promise<any> {
    
    return await this.db.object(url).valueChanges().pipe(first()).toPromise()
    
  }

  async listFirstMapAF5(url: string, child: string): Promise<any> {
    return await this.db.list(url, this.order(child)).snapshotChanges().pipe(first()).pipe(
      map(actions => {
        return actions.map(action => ({ $key: action.key, ...action.payload.val() as {} }));
      })).toPromise()
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
    return this.promiseBool(this.db.object(url).remove())
  }

  objectSetBool(url: string, obj: any): Promise<boolean> {
    return this.promiseBool(this.db.object(url).set(obj))
  }

  objectUpdate<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    return this.promise<T>(this.db.object(url).update(obj), fn)
  }

  objectUpdateBool(url: string, obj: any): Promise<boolean> {
    return this.promiseBool(this.db.object(url).update(obj))
  }

  //angular-2-and-firebase-throwing-thenablereference-exception-on-form-submit
  //https://stackoverflow.com/a/44426633
  // private tr2p(tr: ThenableReference): Promise<any> {
  private tr2p(tr): Promise<any> {
    return new Promise(function (resolve, reject) {
      tr.then(x => resolve(x), x => reject(x));
    });
  }

  listPush<T>(url: string, obj: any, fn: (x) => T): Promise<T> {
    //TBD: CHECK 3rd point
    //https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
    return this.promise<T>(this.tr2p(this.db.list(url).push(obj)), fn)
  }

}
