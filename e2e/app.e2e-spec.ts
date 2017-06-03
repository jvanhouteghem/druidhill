import { DruidhillPage } from './app.po';

describe('druidhill App', () => {
  let page: DruidhillPage;

  beforeEach(() => {
    page = new DruidhillPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
