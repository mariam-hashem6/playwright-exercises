import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { RegistrationPage } from "../pages/registration.page";
import { DashboardPage } from "../pages/dashboard.page";
import { createRegistrationUser, loadJson } from "../utils/test-data-helper";
import { User } from "../types/user";

test.describe('Automated Product Checkout E2E Flow', () => {
    test('completes product checkout', async ({ page }) => {

        const users = loadJson<User[]>("users-data.json");
        const userWithUpdatedEmail = createRegistrationUser(users[1]);
        const productName = 'MacBook Pro M4';
        const loginPage = new LoginPage(page);
        const registrationPage = new RegistrationPage(page);
        const dashboardPage = new DashboardPage(page);

        await test.step('register a new user', async () => {
            await loginPage.open();
            await loginPage.navigateToRegistration();
            await registrationPage.register(userWithUpdatedEmail);
            await expect(registrationPage.successToast).toBeVisible();
            await expect(registrationPage.successMessage).toBeVisible();
        });

        await test.step('log in with the registered user', async () => {
            await registrationPage.navigateToLogin();
            await loginPage.login(userWithUpdatedEmail.email, userWithUpdatedEmail.password);
            await page.waitForURL('**/client/#/dashboard/dash');
            await expect(loginPage.loginToast).toBeVisible();
        });

        await test.step('validate no products in cart', async () => {
            await dashboardPage.getProductCard(productName);
            await expect(dashboardPage.getProductCard(productName)).toHaveCount(0);
            await dashboardPage.goToCart();
            await expect(dashboardPage.noProductsToast).toBeVisible();
            await expect(dashboardPage.noProductsMessage).toBeVisible();
        });
    });
});