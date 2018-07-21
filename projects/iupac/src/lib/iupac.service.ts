import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IupacService {

  constructor() { }

  public getMessage(): string {
    return "Bingo from Library!"
  }

}
