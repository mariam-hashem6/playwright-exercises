import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { RegistrationPage } from "../pages/registration.page";
import { DashboardPage } from "../pages/dashboard.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { createRegistrationUser, loadJson } from "../utils/test-data-helper";
import { User } from "../types/user";
import { CheckoutDetails } from "../types/checkout-details";
import type { ProductCase } from "../types/product-case";

test.describe('Automated Product Checkout E2E Flow', () => {
    const user = loadJson<User>("users-data.json");
    const checkoutDetails = loadJson<CheckoutDetails>("checkout-data.json");
    const productCases = loadJson<ProductCase[]>("product-cases.json");

    for (const productCase of productCases) {
        test(`handles ${productCase.expectedResult} for ${productCase.name}`, async ({ page }) => {
            const userWithUpdatedEmail = createRegistrationUser(user);
            const loginPage = new LoginPage(page);
            const registrationPage = new RegistrationPage(page);
            const dashboardPage = new DashboardPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            await test.step('register a new user', async () => {
                await loginPage.open();
                await loginPage.navigateToRegistration();
                await expect(page).toHaveURL(/\/client\/#\/auth\/register$/);
                await registrationPage.register(userWithUpdatedEmail);
                await expect(registrationPage.successToast).toBeVisible();
                await expect(registrationPage.successMessage).toBeVisible();
            });

            await test.step('log in with the registered user', async () => {
                await registrationPage.navigateToLogin();
                await expect(page).toHaveURL(/\/client\/#\/auth\/login$/);
                await loginPage.login(userWithUpdatedEmail.email, userWithUpdatedEmail.password);
                await expect(page).toHaveURL(/dashboard\/dash/);
                await expect(loginPage.loginToast).toBeVisible();
            });

            if (productCase.expectedResult === 'addedToCart') {
                await test.step('add the product to the cart', async () => {
                    await dashboardPage.addProductToCart(productCase.name);
                    await expect(dashboardPage.productAddedToast).toBeVisible();
                    await expect(dashboardPage.cartBadge).toHaveText('1');
                    await dashboardPage.goToCart();
                    await expect(page).toHaveURL(/\/client\/#\/dashboard\/cart$/);
                });

                await test.step('complete checkout', async () => {
                    await cartPage.proceedToCheckout();
                    await expect(page).toHaveURL(/\/client\/#\/dashboard\/order(?:[/?].*)?$/);
                    await checkoutPage.fillCardInfo(checkoutDetails);
                    await checkoutPage.placeOrder();
                    await expect(page).toHaveURL(/\/client\/#\/dashboard\/thanks(?:[/?].*)?$/);
                    await expect(checkoutPage.orderPlacedToast).toBeVisible();
                    await expect(checkoutPage.thankYouMessage).toBeVisible();
                });

            } else if (productCase.expectedResult === 'notAvailable') {
                await test.step('validate product is not available', async () => {
                    await expect(dashboardPage.getProductCard(productCase.name)).toHaveCount(0);
                });

                await test.step('validate cart is empty', async () => {
                    await dashboardPage.goToCart();
                    await expect(page).toHaveURL(/\/client\/#\/dashboard\/cart$/);
                    await expect(dashboardPage.noProductsToast).toBeVisible();
                    await expect(dashboardPage.noProductsMessage).toBeVisible();
                });
            }
        });
    }
});