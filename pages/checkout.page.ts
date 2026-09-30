import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import type { CheckoutDetails } from "../types/checkout-details";

export class CheckoutPage extends BasePage {

    private readonly cardNumberLocator: Locator;
    private readonly cvvLocator: Locator;
    private readonly cardNameLocator: Locator;
    private readonly selectCountryLocator: Locator;
    private readonly countryDropdownResultsLocator: Locator;
    private readonly placeOrderLocator: Locator;
    readonly orderPlacedToast: Locator;
    readonly thankYouMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.cardNumberLocator = page.getByRole('textbox').first();
        this.cvvLocator = page.getByRole('textbox').nth(1);
        this.cardNameLocator = page.getByRole('textbox').nth(2);

        this.selectCountryLocator = page.getByRole('textbox', { name: 'Select Country' });
        this.countryDropdownResultsLocator = page.locator("section.ta-results");
        this.placeOrderLocator = page.getByText("Place Order");
        this.orderPlacedToast = page.getByText("Order Placed Successfully");
        this.thankYouMessage = page.getByRole('heading', { name: 'Thankyou for the order.' });
    }

    async fillCardInfo(details: CheckoutDetails): Promise<void> {
        await this.cardNumberLocator.fill(details.cardNumber);
        await this.cvvLocator.fill(details.cvv);
        await this.cardNameLocator.fill(details.cardName);
        await this.selectCountryLocator.pressSequentially(details.country, { delay: 100 });
        const countryOption = this.countryDropdownResultsLocator.getByRole("button", { name: details.country });
        await countryOption.waitFor({ state: 'visible' });
        await countryOption.click();
    }

    async placeOrder(): Promise<void> {
        await Promise.all([
            this.page.waitForURL('**/client/#/dashboard/thanks**'),
            this.placeOrderLocator.click(),
        ]);
    }
}