import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { User as FBUser, GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { SecurityAPI } from './data.service';
import { User, UserRole } from './user';
import { Lib } from './lib';

class UserFbImpl implements User {
  constructor(private fbUser: FBUser) { }
  get uid() {
    return this.fbUser.uid
  }
  get name() {
    return this.fbUser.displayName
  }
  get email() {
    return this.fbUser.email
  }
  // NOTE: Placeholder role
  get role(): UserRole {
    return UserRole.USER
  }
  public toString = (): string => {
    return this.name
  }
}

@Injectable()
export class FirebaseSecuritySource implements SecurityAPI {
  readonly fbProvider = new GoogleAuthProvider()

  constructor(protected afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/student-dash'])
      } else {
        console.log('LOGGED OUT!')
      }
    })
  }

  // Used only in user.component.html
  public async user() {
    let usr = await this.afAuth.currentUser
    if (usr) return new UserFbImpl(usr)
    else return null
  }

  public userWait(): Promise<User> {
    if (this.isLoggedIn()) return Promise.resolve(this.user())
    else {
      return new Promise(resolve => {
        this.afAuth.onAuthStateChanged(user => {
          Lib.failifold(user == null, 'User cannot be null')
          resolve(new UserFbImpl(user))
        })
      })
    }
  }

  // Used only in URL AuthGaurd
  public async isLoggedIn(): Promise<boolean> {
    return await this.user() !== null
  }

  // Used only in Login component
  public login(): Promise<any> {
    return Promise.resolve(this.afAuth.signInWithPopup(this.fbProvider))
  }

  // Used only in user component
  public logout(): Promise<void> {
    return Promise.resolve(this.afAuth.signOut())
  }
}
