import { Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import type { RegistrationUser } from '../types/registration-user';

export class RegistrationPage extends BasePage {

    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly phoneInput: Locator;
    private readonly occupationSelect: Locator;
    private readonly maleRadio: Locator;
    private readonly femaleRadio: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly ageCheck: Locator;
    private readonly registerButton: Locator;
    readonly successToast: Locator;
    readonly successMessage: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('email@example.com');
        this.phoneInput = page.getByPlaceholder('enter your number');
        this.occupationSelect = page.getByRole('combobox');
        this.maleRadio = page.getByRole('radio', { name: 'Male' });
        this.femaleRadio = page.getByRole('radio', { name: 'Female' });
        this.passwordInput = page.getByRole('textbox', { name: 'Passsword' });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
        this.ageCheck = page.getByRole('checkbox');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.successToast = page.getByLabel('Registered Successfully');
        this.successMessage = page.getByText('Account Created Successfully');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async register(user: RegistrationUser): Promise<void> {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.phoneInput.fill(user.phone);
        await this.occupationSelect.selectOption(user.occupation);

        if (user.gender === 'Male') {
            await this.maleRadio.check();
        } else {
            await this.femaleRadio.check();
        }
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.confirmPassword);
        await this.ageCheck.check();
        await this.registerButton.click();
    }

    async navigateToLogin(): Promise<void> {
        await Promise.all([
            this.page.waitForURL('**/client/#/auth/login'),
            this.loginButton.click(),
        ]);
    }
}
