import { Injectable } from '@angular/core';

import { SecuritySource } from "./data.service";
import { User } from "./user";

class UserImpl implements User {
  constructor(private _uid, private _name, private _email) { }
  get uid() {
    return this._uid
  }
  get name() {
    return this._name
  }
  get email() {
    return this._email
  }
  public toString = (): string => {
    return this.name
  }
}

@Injectable()
export class MockSecuritySource implements SecuritySource {
  private _user = new UserImpl('00', 'Mock User', 'mock@example.com')

  constructor() {
    //console.log(this._user)
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
