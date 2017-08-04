import { TestBed, async, inject } from '@angular/core/testing';
import { DataService, DataSource, SecuritySource, isin } from './data.service';
import { MockDataSource } from './mock-data-source.service';
import { MockSecuritySource } from './mock-security-source.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataSource, useClass: MockDataSource },
        { provide: SecuritySource, useClass: MockSecuritySource },
        { provide: DataService, useClass: DataService },
      ]
    });
  });

  it('Hello mic. testing... Hello!!', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
    expect(service.testMe(3)).toBe(6)
    expect(service.testMe(2)).toBe(4)
  }));
})

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
