import { TestBed, async, inject } from '@angular/core/testing';
import { DataService, isin } from './data.service';

/*
describe('DataService2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataService2, useClass: DataService2 },
      ]
    });
  });

  it('Hello mic. testing... Hello!!', inject([DataService2], (service: DataService2) => {
    expect(service).toBeTruthy();
    expect(service.testMe(3)).toBe(6)
    expect(service.testMe(2)).toBe(4)
  }));
})
*/

describe('isin tests:', () => {

  it('is in, checked', () => {
    expect(isin([1, 2, 4], 1)).toBeTruthy()
    expect(isin([1, 2, 4], 4)).toBeTruthy()
    expect(isin([1, 2, 4], 3)).toBeFalsy()
    expect(isin([1, 2, 4], 0)).toBeFalsy()
    expect(isin([1], 1)).toBeTruthy()
    expect(isin([0], 1)).toBeFalsy()
    expect(isin([], 1)).toBeFalsy()
  })
})
