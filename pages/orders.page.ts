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

  async getLastOrderId(): Promise<string> {
    const orderId = this.getOrderRowsLocator().last().getByRole("rowheader");
    await expect(orderId).toBeVisible();
    return (await orderId.innerText()).trim();
  }

  async viewOrder(orderId: string): Promise<void> {
    await this.getOrderRowLocator(orderId).getByRole("button", { name: "View" }).click();
  }
}