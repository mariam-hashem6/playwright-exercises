import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ThankYouPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private getOrderPlacedToastLocator(): Locator {
        return this.page.getByText("Order Placed Successfully");
    }

    private getThankYouMessageLocator(): Locator {
        return this.page.getByRole("heading", { name: "Thankyou for the order." });
    }

    async expectOrderPlaced(): Promise<void> {
        await expect(this.page).toHaveURL(/\/client\/#\/dashboard\/thanks(?:[/?].*)?$/);
        await expect(this.getOrderPlacedToastLocator()).toBeVisible();
        await expect(this.getThankYouMessageLocator()).toBeVisible();
    }

    async getOrderIds(): Promise<string[]> {
        const cellTexts = await this.page.getByRole("cell").allInnerTexts();
        const orderIdsCell = cellTexts
            .map((text) => text.trim())
            .find((text) => text.startsWith("|") && text.endsWith("|"));
        if (!orderIdsCell) {
            throw new Error("Could not find the order IDs cell on the thank-you page.");
        }
        const orderIds = orderIdsCell.split("|").map((orderId) => orderId.trim()).filter(Boolean);
        return orderIds;
    }
}
