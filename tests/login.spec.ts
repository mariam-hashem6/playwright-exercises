import test, { expect } from "@playwright/test";
import { loadJson } from "../utils/test-data-helper";
import { LoginPage } from "../pages/login.page";
import { LoginCase } from "../types/login-case";

for (const loginCase of loadJson<LoginCase[]>("login-cases.json")) {
    test(`validate login with ${loginCase.name}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login(loginCase.email, loginCase.password);
        switch (loginCase.expectedResult) {
            case 'success':
                await page.waitForURL('**/client/#/dashboard/dash');
                await expect(loginPage.loginToast).toBeVisible();
                break;

            case 'invalidEmail':
                await expect(loginPage.invalidEmailError).toBeVisible();
                break;

            case 'incorrectCredentials':
                await expect(loginPage.incorrectCredentialsError).toBeVisible();
                break;

            case 'requiredFields':
                await expect(loginPage.emailRequiredError).toBeVisible();
                await expect(loginPage.passwordRequiredError).toBeVisible();
                break;
        }
    });
}