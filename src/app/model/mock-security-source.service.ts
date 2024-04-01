import { Injectable } from '@angular/core';

import { SecurityAPI } from './data.service';
import { User, EMPTY_USER } from './user';

@Injectable()
export class MockSecuritySource implements SecurityAPI {
  private _user = EMPTY_USER

  constructor() {
    // console.log(this._user)
  }

  public async user() {
    return this._user
  }

  public async userWait() {
    return this._user
  }

  public async isLoggedIn() {
    return Promise.resolve(await this.user() !== null)
  }

  public async login() {
    return true
  }

  public async logout() {
    return
  }
}
