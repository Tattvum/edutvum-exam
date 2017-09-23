import { GeneralContext, GeneralContextImpl } from './general-context';

describe('GeneralContext tests:', () => {
  let gci = new GeneralContextImpl()
  it('alert works', () => {
    window.alert = jasmine.createSpy('alert').and.stub();
    gci.alert('BINGO')
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('BINGO')
  })
  it('confirm works true', () => {
    window.confirm = spyOn(window, 'confirm').and.returnValue(true)
    expect(gci.confirm('BINGO1')).toBe(true)
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('BINGO1')
  })
  it('confirm works true', () => {
    window.confirm = spyOn(window, 'confirm').and.returnValue(false)
    expect(gci.confirm('BINGO2')).toBe(false)
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('BINGO2')
  })
})

