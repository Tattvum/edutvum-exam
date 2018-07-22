import { TestBed, inject } from '@angular/core/testing'

import { IupacService } from './iupac.service'

describe('iupac.service.ts', function () {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IupacService]
    }).compileComponents()
  })

  it('SMILES to IUPAC conversion', inject([IupacService], (service) => {
    expect(service.iupac('CC'))
      .toBe('ethane')
    expect(service.iupac('CCCCC'))
      .toBe('pentane')
    expect(service.iupac('CCCCCCCCCCCCCCCCCCC'))
      .toBe('nonadecane')
    expect(service.iupac('C(CCCCCCCCCCC)CCCCCCCC'))
      .toBe('icosane')
    expect(service.iupac('CCCCCCCCCCCCCCCCCCCCC'))
      .toBe('henicosane')

    expect(service.iupac('CC(C)C'))
      .toBe('2-methylpropane')
    expect(service.iupac('C(CC(C)C)(C)C'))
      .toBe('2,4-dimethylpentane')
    expect(service.iupac('C(C(CC(CC)C)CC)C'))
      .toBe('3-ethyl-5-methylheptane')
    expect(service.iupac('CC(CC(CCC)C(C)C)C'))
      .toBe('4-isopropyl-2-methylheptane')
    expect(service.iupac('CCCC(C(CCCC)C(C(C)C)C)C(C)C'))
      .toBe('5-(1,2-dimethylpropyl)-4-isopropylnonane')
    expect(service.iupac('CCCC(C(CCCC)CC(C)C)C(C)C'))
      .toBe('5-isobutyl-4-isopropylnonane')
    expect(service.iupac('CCCCC(CCCC)CC(C(C)C(C)C)C'))
      .toBe('6-butyl-2,3,4-trimethyldecane')
    expect(service.iupac('C(C(CCCCC)C(C(CC)C)C(CC)C)CCCC'))
      .toBe('6-(1-sec-butyl-2-methylbutyl)undecane')
    expect(service.iupac('CC'))
      .toBe('ethane')
  }))
})
