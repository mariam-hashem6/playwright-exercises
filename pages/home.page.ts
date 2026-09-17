import { type Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export type CustomerData = {
    name: string;
    email: string;
    password: string;
    lovesIceCream: boolean;
    gender: 'Male' | 'Female';
    employmentStatus: 'Student' | 'Employed' | 'Entrepreneur';
};

export class HomePage extends BasePage {

    private readonly nameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loveIceCreamCheckbox: Locator;
    private readonly genderSelect: Locator;
    private readonly studentRadio: Locator;
    private readonly employedRadio: Locator;
    private readonly entrepreneurRadio: Locator;
    private readonly submitButton: Locator;
    private readonly shopLink: Locator;
    readonly successAlert: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator('form').locator('input[name="name"]');
        this.emailInput = page.locator('form').locator('input[name="email"]');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loveIceCreamCheckbox = page.getByLabel('Check me out if you Love IceCreams!');
        this.genderSelect = page.getByLabel('Gender');
        this.studentRadio = page.getByRole('radio', { name: 'Student' });
        this.employedRadio = page.getByRole('radio', { name: 'Employed' });
        this.entrepreneurRadio = page.getByRole('radio', { name: 'Entrepreneur' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.shopLink = page.getByRole('link', { name: 'Shop' });
        this.successAlert = page.locator('.alert-success');
    }

    override async open(): Promise<void> {
        await super.open();
    }

    async fillForm(data: CustomerData): Promise<void> {
        await this.nameInput.fill(data.name);
        await this.emailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.loveIceCreamCheckbox.setChecked(data.lovesIceCream);
        await this.genderSelect.selectOption(data.gender);
        const radioMap = {
            Student: this.studentRadio,
            Employed: this.employedRadio,
            Entrepreneur: this.entrepreneurRadio,
        };
        await radioMap[data.employmentStatus].check();
    }
    
    async submitForm(): Promise<void> {
        await this.submitButton.click();
    }

    async navigateToShop(): Promise<void> {
        await this.shopLink.click();
    }
}