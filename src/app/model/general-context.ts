import { Injectable } from '@angular/core';

import { Lib } from './lib';

@Injectable()
export abstract class GeneralContext {
  public abstract confirm(msg: string): boolean
}

@Injectable()
export class GeneralContextImpl extends GeneralContext {
  public confirm(msg: string): boolean {
    return confirm(msg)
  }
}
