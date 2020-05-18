import { Injectable } from '@angular/core';

import { SecurityAPI } from './data.service';
import { User, EMPTY_USER } from './user';

@Injectable()
export class MockSecuritySource implements SecurityAPI {
  private _user = EMPTY_USER

  constructor() {
    // console.log(this._user)
  }

  public user(): User {
    return this._user
  }

  public userWait(): Promise<User> {
    return Promise.resolve(this._user)
  }

  public isLoggedIn(): boolean {
    return this.user() !== null
  }

  public login(): Promise<any> {
    return Promise.resolve(true)
  }

  public logout(): Promise<void> {
    return Promise.resolve()
  }
}
