import { EdutvumExamPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('edutvum-exam App', () => {
  //https://stackoverflow.com/questions/46527912/protractor-scripttimeouterror-asynchronous-script-timeout-result-was-not-rec/46532400
  browser.waitForAngularEnabled(false);
  let page: EdutvumExamPage;

  beforeEach(() => {
    page = new EdutvumExamPage();
  });

  it('Title checked', async () => {
    await page.navigateTo();
    expect(await page.getTitle()).toEqual('Edutvum Exam');
  });

  xit('Create Exam works', async () => {
    expect(await page.getCreateExamButtonText()).toEqual('Create Exam!');
  });
})
