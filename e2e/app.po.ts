import { browser, element, by } from 'protractor';

export class EdutvumExamPage {

  navigateTo() {
    return browser.get('/');
  }

  getCreateExamButton() {
    return element(by.id('create-exam-button'));
  }

  getCreateExamButtonText() {
    return element(by.id('create-exam-button')).getText();
  }

  getTitle() {
    return browser.getTitle();
  }

}
