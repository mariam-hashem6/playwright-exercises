import {Locator, type Page} from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

    private readonly registerLink: Locator;

    constructor(page: Page) {
        super(page);
        this.registerLink = page.getByRole('link', { name: 'Register here' });
    }

    override async open(): Promise<void> {
        await super.open();
    }

}