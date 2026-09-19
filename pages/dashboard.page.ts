import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {

    private readonly productCards: Locator;
    private readonly cartButton: Locator;
    private readonly cartBadge: Locator;
    readonly productAddedToast: Locator;

    constructor(page: Page) {
        super(page);
        this.productCards = page.locator('.card');
        this.cartButton = page.locator('button[routerlink="/dashboard/cart"]');
        this.cartBadge = this.cartButton.locator('label');
        this.productAddedToast = page.getByRole('alert', { name: 'Product Added To Cart' });
    }

    async addProductToCart(productName: string): Promise<void> {
        const targetCard = this.productCards.filter({ hasText: productName });
        await targetCard.getByRole('button', { name: 'Add To Cart' }).click();
    }

    async getCartCount() {
        return await this.cartBadge.innerText();
    }

    async goToCart() {
        await Promise.all([
            this.page.waitForURL('**/client/#/dashboard/cart'),
            this.cartButton.click(),
        ]);
    }
}