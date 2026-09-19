import { Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

    private readonly registerLink: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    readonly loginToast: Locator;

    constructor(page: Page) {
        super(page);
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.usernameInput = page.getByPlaceholder('email@example.com');
        this.passwordInput = page.getByPlaceholder('enter your passsword');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.loginToast = page.getByText('Login Successfully');
    }

    async navigateToRegistration(): Promise<void> {
        await Promise.all([
            this.page.waitForURL('**/client/#/auth/register'),
            this.registerLink.click(),
        ]);
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await Promise.all([
            this.page.waitForURL('**/client/#/dashboard/dash'),
            this.loginButton.click(),
        ]);
    }

}