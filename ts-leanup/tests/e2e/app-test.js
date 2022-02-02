const ACTION_DELAY = 250;

describe(`Demo's`, () => {
  function testFall(url) {
    it(`Run tests on ${url}`, (browser) => {
      browser.url(url).pause(ACTION_DELAY).end();
    });
  }

  ['http://localhost:8080/'].forEach((url) => {
    testFall(url);
  });
});
