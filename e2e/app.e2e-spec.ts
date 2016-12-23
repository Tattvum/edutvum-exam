import { EdutvumExamPage } from './app.po';

describe('edutvum-exam App', function() {
  let page: EdutvumExamPage;

  beforeEach(() => {
    page = new EdutvumExamPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
