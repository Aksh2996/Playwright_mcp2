import 'dotenv/config';
import { After, Before, Given, When } from '@cucumber/cucumber';
import { chromium, type Browser, type Page } from 'playwright';
import { LoginPage } from '../page';

interface LoginWorld {
  browser?: Browser;
  page?: Page;
  loginPage?: LoginPage;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getLoginPage(world: LoginWorld): LoginPage {
  if (!world.loginPage) {
    throw new Error('The EventHub login page has not been initialized.');
  }
  return world.loginPage;
}

Before({ tags: '@login' }, async function (this: LoginWorld) {
  this.browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  this.page = await this.browser.newPage({ viewport: null });
  this.loginPage = new LoginPage(this.page);
});

After({ tags: '@login' }, async function (this: LoginWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});

Given(
  'I navigate to the EventHub login page at {string}',
  async function (this: LoginWorld, url: string) {
    await getLoginPage(this).navigate(url);
  },
);

When('I enter the configured EventHub credentials', async function (this: LoginWorld) {
  await getLoginPage(this).enterCredentials(
    requiredEnv('EVENTHUB_USERNAME'),
    requiredEnv('EVENTHUB_PASSWORD'),
  );
});

When('I click the {string} button', async function (this: LoginWorld, buttonName: string) {
  if (buttonName !== 'Sign In') {
    throw new Error(`Unsupported login button: ${buttonName}`);
  }
  await getLoginPage(this).signIn();
});
