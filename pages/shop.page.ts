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

    async addProductToCart(productName: string): Promise<void> {
        const targetCard = this.productCards.filter({ hasText: productName });
        await targetCard.getByRole('button', { name: 'Add' }).click();
    }

    async addProductsToCart(productNames: string[]): Promise<void> {
        for (const name of productNames) {
            await this.addProductToCart(name);
        }
    }

}