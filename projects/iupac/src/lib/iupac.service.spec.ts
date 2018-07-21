import { TestBed, inject } from '@angular/core/testing';

import { IupacService } from './iupac.service';

describe('IupacService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IupacService]
    });
  });

  it('should be created', inject([IupacService], (service: IupacService) => {
    expect(service).toBeTruthy();
  }));
});
