const assert = require('node:assert/strict');
const { After, Before, Given, Then, When } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

let browser;
let page;

Before({ tags: 'not @login' }, async function () {
  browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  page = await browser.newPage({ viewport: null });
});

After({ tags: 'not @login' }, async function () {
  await browser.close();
});

Given('I open the Playwright homepage', async function () {
  await page.goto('https://playwright.dev/');
});

When('I follow the {string} link', async function (name) {
  await page.getByRole('link', { name }).click();
});

Then('the page title should contain {string}', async function (expectedText) {
  const title = await page.title();
  assert.ok(title.includes(expectedText), `Expected page title "${title}" to contain "${expectedText}"`);
});

Then('I should see the {string} heading', async function (heading) {
  await page.getByRole('heading', { name: heading }).waitFor({ state: 'visible' });
});
