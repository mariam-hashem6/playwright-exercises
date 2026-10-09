import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import type { CheckoutDetails } from "../types/checkout-details";

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private getFieldsLocator(): Locator {
        return this.page.locator(".field");
    }

    getCardNumberLocator(): Locator {
        return this.getFieldsLocator().filter({ hasText: "Credit Card Number" }).getByRole("textbox");
    }

    private getExpiryMonthLocator(): Locator {
        return this.getFieldsLocator().filter({ hasText: "Expiry Date" }).getByRole("combobox").nth(0);
    }

    private getExpiryYearLocator(): Locator {
        return this.getFieldsLocator().filter({ hasText: "Expiry Date" }).getByRole("combobox").nth(1);
    }

    getCvvLocator(): Locator {
        return this.getFieldsLocator().filter({ hasText: "CVV Code" }).getByRole("textbox");
    }

    getCardNameLocator(): Locator {
        return this.getFieldsLocator().filter({ hasText: "Name on Card" }).getByRole("textbox");
    }

    getSelectCountryLocator(): Locator {
        return this.page.getByRole("textbox", { name: "Select Country" });
    }

    private getCountryDropdownResultsLocator(): Locator {
        return this.page.locator("section.ta-results");
    }

    getPlaceOrderLocator(): Locator {
        return this.page.getByText("Place Order");
    }

    async fillCardInfo(details: CheckoutDetails): Promise<void> {
        await this.getCardNumberLocator().fill(details.cardNumber);
        await this.getExpiryMonthLocator().selectOption({ label: details.expiryMonth });
        await this.getExpiryYearLocator().selectOption({ label: details.expiryYear });
        await this.getCvvLocator().fill(details.cvv);
        await this.getCardNameLocator().fill(details.cardName);
        await this.getSelectCountryLocator().pressSequentially(details.country, { delay: 100 });
        const countryOption = this.getCountryDropdownResultsLocator().getByRole("button", { name: details.country });
        await countryOption.click();
    }

    async placeOrder(): Promise<void> {
        await this.getPlaceOrderLocator().click();
    }
}