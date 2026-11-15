import type { Page } from 'playwright';
import { loginPageModel } from './model';

export class LoginPage {
  private readonly model: ReturnType<typeof loginPageModel>;

  constructor(private readonly page: Page) {
    this.model = loginPageModel(page);
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.model.emailInput.fill(username);
    await this.model.passwordInput.fill(password);
  }

  async signIn(): Promise<void> {
    await this.model.signInButton.click();
  }
}
