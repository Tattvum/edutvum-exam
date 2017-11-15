import { Injectable } from '@angular/core';

import { Lib } from './lib';

@Injectable()
export abstract class GeneralContext {
  public abstract alert(msg: string)
  public abstract confirm(msg: string): boolean
  public abstract prompt(msg: string): string
}

@Injectable()
export class GeneralContextImpl extends GeneralContext {
  public alert(msg: string) {
    alert(msg)
  }
  public confirm(msg: string): boolean {
    return confirm(msg)
  }
  public prompt(msg: string): string {
    return prompt(msg)
  }
}
