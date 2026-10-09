import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    getCheckoutButtonLocator(): Locator {
        return this.page.getByRole("button", { name: "Checkout" });
    }

    async proceedToCheckout(): Promise<void> {
        await this.getCheckoutButtonLocator().click();
    }

    getProductRowLocator(productName: string): Locator {
        return this.page.locator('div.cartSection h3').filter({ hasText: productName });
    }

    async expectProductInCart(productName: string): Promise<void> {
        await expect(this.getProductRowLocator(productName), `Expected product ${productName} to be in the cart`).toBeVisible();
    }

    async expectProductsInCart(productNames: string[]): Promise<void> {
        for (const productName of productNames) {
            await this.expectProductInCart(productName);
        }
    }
}