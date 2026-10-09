import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {

    private readonly productCards: Locator;
    private readonly cartButton: Locator;
    readonly cartBadge: Locator;
    readonly productAddedToast: Locator;
    readonly noProductsToast: Locator;
    readonly noProductsMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.productCards = page.locator('.card');
        this.cartButton = page.getByRole('navigation').getByRole('button', { name: /Cart/i });
        this.cartBadge = this.cartButton.locator('label');
        this.productAddedToast = page.getByRole('alert', { name: 'Product Added To Cart' });
        this.noProductsToast = page.getByRole('alert', { name: 'No Product in Your Cart' });
        this.noProductsMessage = page.getByText('No Products in Your Cart !');    
    }

    getProductCard(productName: string): Locator {
        return this.productCards.filter({ hasText: productName });
    }

    async addProductToCart(productName: string): Promise<void> {
        const targetCard = this.getProductCard(productName);
        await targetCard.getByRole('button', { name: 'Add To Cart' }).click();
    }

    async goToCart(): Promise<void> {
        await this.cartButton.click();
    }
}