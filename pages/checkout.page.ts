import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import type { CheckoutDetails } from "../types/checkout-details";

export class CheckoutPage extends BasePage {

    private readonly fieldLocator: Locator;
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
        this.fieldLocator = page.locator('.field');
        this.cardNumberLocator = this.fieldLocator.filter({ hasText: "Credit Card Number" }).getByRole("textbox");;
        this.cvvLocator = this.fieldLocator.filter({ hasText: "CVV Code" }).getByRole("textbox");;
        this.cardNameLocator = this.fieldLocator.filter({ hasText: "Name on Card" }).getByRole("textbox");;

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
        await countryOption.click();
    }

    async placeOrder(): Promise<void> {
        await this.placeOrderLocator.click();
    }
}