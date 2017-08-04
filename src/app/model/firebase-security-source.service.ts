import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { SecuritySource } from "./data.service";
import { User } from "./user";
import { Lib } from "./lib";

class UserFbImpl implements User {
  constructor(private fbUser: firebase.User) { }
  get uid() {
    return this.fbUser.uid
  }
  get name() {
    return this.fbUser.displayName
  }
  get email() {
    return this.fbUser.email
  }
  public toString = (): string => {
    return this.name
  }
}

@Injectable()
export class FirebaseSecuritySource implements SecuritySource {
  readonly fbProvider = new firebase.auth.GoogleAuthProvider()

  constructor(protected afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/student-dash'])
      } else {
        console.log('LOGGED OUT!')
      }
    })
  }

  //Used only in user.component.html
  public user(): User {
    let user: firebase.User = this.afAuth.auth.currentUser
    if (user) return new UserFbImpl(user)
    else return null
  }

  public userWait(): Promise<User> {
    if (this.isLoggedIn()) return Promise.resolve(this.user())
    else {
      return new Promise(resolve => {
        this.afAuth.auth.onAuthStateChanged(user => {
          Lib.assert(user == null, 'User cannot be null')
          resolve(new UserFbImpl(user))
        })
      })
    }
  }

  //Used only in URL AuthGaurd
  public isLoggedIn(): boolean {
    return this.user() !== null
  }

  //Used only in Login component
  public login(): Promise<any> {
    return Promise.resolve(this.afAuth.auth.signInWithPopup(this.fbProvider))
  }

  //Used only in user component
  public logout(): Promise<void> {
    return Promise.resolve(this.afAuth.auth.signOut())
  }
}
