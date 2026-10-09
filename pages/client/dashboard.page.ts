import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private getProductCardsLocator(): Locator {
        return this.page.locator(".card");
    }

    private getCartButtonLocator(): Locator {
        return this.page.getByRole("navigation").getByRole("button", { name: /Cart/i });
    }

    getCartBadgeLocator(): Locator {
        return this.getCartButtonLocator().locator("label");
    }

    getProductAddedToastLocator(): Locator {
        return this.page.getByRole("alert", { name: "Product Added To Cart" });
    }

    getNoProductsToastLocator(): Locator {
        return this.page.getByRole("alert", { name: "No Product in Your Cart" });
    }

    getNoProductsMessageLocator(): Locator {
        return this.page.getByText("No Products in Your Cart !");
    }

    getProductCard(productName: string): Locator {
        return this.getProductCardsLocator().filter({ hasText: productName });
    }

    async addProductToCart(productName: string): Promise<void> {
        const targetCard = this.getProductCard(productName);
        await targetCard.getByRole('button', { name: 'Add To Cart' }).click();
    }

    async addProductsToCart(productNames: string[]): Promise<void> {
        for (const productName of productNames) {
            await this.addProductToCart(productName);
            await expect(this.getProductAddedToastLocator()).toBeVisible();
        }
    }

    async expectCartItemCount(count: number): Promise<void> {
        await expect(this.getCartBadgeLocator()).toHaveText(String(count));
    }

    async goToCart(): Promise<void> {
        await this.getCartButtonLocator().click();
    }

}