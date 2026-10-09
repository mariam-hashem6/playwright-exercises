import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
    private readonly checkoutButton;
    constructor(page: Page) {
        super(page);
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}