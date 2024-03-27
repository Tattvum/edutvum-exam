import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export abstract class GeneralContext {
  public abstract alert(msg: string)
  public abstract confirm(msg: string): boolean
  public abstract prompt(msg: string, _default?: string): string
}

@Injectable()
export class GeneralContextImpl extends GeneralContext {
  constructor(private _snackBar: MatSnackBar) {
    super()
  }

  public alert(msg: string) {
    // alert(msg)
    let snackBarRef = this._snackBar.open(msg, "Dismiss", { duration: 2000 })
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss()
    })
  }
  public confirm(msg: string): boolean {
    return confirm(msg)
  }
  public prompt(msg: string, _default: string = ""): string {
    return prompt(msg, _default)
  }
}
