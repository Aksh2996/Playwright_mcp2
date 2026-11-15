import type { Page } from 'playwright';

export function loginPageModel(page: Page) {
  return {
    emailInput: page.getByLabel('Email'),
    passwordInput: page.getByLabel('Password'),
    signInButton: page.getByRole('button', { name: 'Sign In', exact: true }),
  };
}
