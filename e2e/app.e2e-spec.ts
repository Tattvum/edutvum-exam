import { EdutvumExamPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('edutvum-exam App', () => {
  let page: EdutvumExamPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    page = new EdutvumExamPage();
  });

  it('should display message saying app works', async () => {
    await page.navigateTo();
    expect(await page.getTitle()).toEqual('Edutvum Exam');
  });
})
