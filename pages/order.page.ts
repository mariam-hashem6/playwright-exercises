import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class OrderPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  getOrderIdLocator(orderId: string): Locator {
    return this.page.getByText(orderId, { exact: true });
  }

  async expectOrderId(orderId: string): Promise<void> {
    await expect(this.getOrderIdLocator(orderId)).toBeVisible();
  }
}
