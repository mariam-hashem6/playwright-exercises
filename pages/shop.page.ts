import { type Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ShopPage extends BasePage {
    private readonly productCards: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productCards = page.locator('app-card');
        this.checkoutButton = page.locator('a.nav-link').filter({ hasText: 'Checkout' });
    }

    async addFirstAndLastProductsToCart(): Promise<void> {
        await this.productCards.first().getByRole('button', { name: 'Add' }).click();
        await this.productCards.last().getByRole('button', { name: 'Add' }).click();
    }

}