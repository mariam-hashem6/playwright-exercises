import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class OrdersPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  async openOrders(): Promise<void> {
    await this.getOrdersButtonLocator().click();
  }

  getOrdersButtonLocator(): Locator {
    return this.page.getByRole("button", { name: /ORDERS/i });
  }

  getOrderRowsLocator(): Locator {
    return this.selectOrderRows();
  }

  getOrderRowLocator(orderId: string): Locator {
    return this.selectOrderRows().filter({
      has: this.page.getByText(orderId, { exact: true }),
    });
  }

  private getOrderIdCellsLocator(): Locator {
    return this.page.locator('th[scope="row"]');
  }

  private selectOrderRows(): Locator {
    return this.page.getByRole("row").filter({
      has: this.getOrderIdCellsLocator(),
    });
  }

  async getOrderIds(): Promise<string[]> {
    const orderIds = this.getOrderRowsLocator().getByRole("rowheader");
    await expect(orderIds.first()).toBeVisible();
    return (await orderIds.allInnerTexts()).map((orderId) => orderId.trim());
  }

  async expectOrderListed(orderId: string): Promise<void> {
    const orderIdCell = this.getOrderRowLocator(orderId).getByRole("rowheader");
    await expect(orderIdCell).toHaveText(orderId);
  }

  async viewOrder(orderId: string): Promise<void> {
    await this.getOrderRowLocator(orderId).getByRole("button", { name: "View" }).click();
  }
}