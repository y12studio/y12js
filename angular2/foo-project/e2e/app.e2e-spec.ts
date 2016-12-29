import { FooProjectPage } from './app.po';

describe('foo-project App', function() {
  let page: FooProjectPage;

  beforeEach(() => {
    page = new FooProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
