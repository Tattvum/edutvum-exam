import { Injectable } from '@angular/core';

import { Lib } from './lib';

@Injectable()
export abstract class GeneralContext {
  public abstract confirm(msg: string): boolean
}

@Injectable()
export class GeneralContextImpl extends GeneralContext {
  public confirmx(msg: string): boolean {
    console.log('GeneralContextImpl', msg)
    return confirm(msg)
  }
  public confirm(msg: string): boolean {
    console.log('GeneralContextImpl2', msg)
    return true
  }
}
