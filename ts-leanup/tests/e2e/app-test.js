const ACTION_DELAY = 250;

describe(`Demo's`, () => {
  function testFall(url) {
    it(`Run tests on ${url}`, (browser) => {
      browser
        .url(url)
        .pause(ACTION_DELAY)
        .waitForElementVisible('h1')
        .pause(ACTION_DELAY)
        .assert.visible('#edit-0')
        .click('#edit-0')
        .pause(ACTION_DELAY)
        .assert.visible('#edit_title')
        .clearValue('#edit_title')
        .pause(ACTION_DELAY)
        .setValue('#edit_title', 'Baum')
        .pause(ACTION_DELAY)
        .assert.visible('#submit')
        .click('#submit')
        .pause(ACTION_DELAY)
        .assert.visible('#add')
        .click('#add')
        .pause(ACTION_DELAY)
        .assert.visible('#new_title')
        .setValue('#new_title', 'Äpfel')
        .pause(ACTION_DELAY)
        .assert.visible('#new_unit')
        .setValue('#new_unit', 'Pack')
        .pause(ACTION_DELAY)
        .assert.visible('#submit')
        .click('#submit')
        .pause(ACTION_DELAY)
        .click('#edit-0')
        .pause(ACTION_DELAY)
        .click('#delete')
        .pause(ACTION_DELAY)
        .click('#edit-1')
        .pause(ACTION_DELAY)
        .click('#delete')
        .pause(ACTION_DELAY)
        .click('#edit-2')
        .pause(ACTION_DELAY)
        .click('#delete')
        .pause(ACTION_DELAY)
        .click('#start')
        .pause(ACTION_DELAY)
        .end();
    });
  }

  [
    'http://localhost:8080/',
    // 'https://github.modevel.de/poc/',
    // 'https://github.modevel.de/poc/canary/',
    // 'https://github.modevel.de/poc/next/',
  ].forEach((url) => {
    testFall(url);
  });
});
