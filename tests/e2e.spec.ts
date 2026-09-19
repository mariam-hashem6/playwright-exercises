import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { RegistrationPage } from "../pages/registration.page";
import { DashboardPage } from "../pages/dashboard.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { createRegistrationUser } from "../data/users";
import { checkoutDetails } from "../data/checkout-data";

const user = createRegistrationUser();
const productName = 'ZARA COAT 3';

test.describe('Automated Product Checkout E2E Flow', () => {
    test('completes product checkout', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const registrationPage = new RegistrationPage(page);
        const dashboardPage = new DashboardPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('register a new user', async () => {
            await loginPage.open();
            await loginPage.navigateToRegistration();
            await registrationPage.register(user);
            await expect(registrationPage.successToast).toBeVisible();
            await expect(registrationPage.successMessage).toBeVisible();
        });

        await test.step('log in with the registered user', async () => {
            await registrationPage.navigateToLogin();
            await loginPage.login(user.email, user.password);
            await expect(loginPage.loginToast).toBeVisible();
            await page.screenshot({ path: 'screenshots/1-after-login.png' });
        });

        await test.step('add the product to the cart', async () => {
            await dashboardPage.addProductToCart(productName);
            await expect(dashboardPage.productAddedToast).toBeVisible();
            await expect(await dashboardPage.getCartCount()).toBe('1');
            await dashboardPage.goToCart();
            await page.screenshot({ path: 'screenshots/02-added-to-cart.png' });
        });

        await test.step('complete checkout', async () => {
            await cartPage.proceedToCheckout();
            await checkoutPage.fillCardInfo(checkoutDetails);
            await page.screenshot({ path: 'screenshots/03-before-place-order.png' });
            await checkoutPage.placeOrder();
            await expect(checkoutPage.orderPlacedToast).toBeVisible();
            await expect(checkoutPage.thankYouMessage).toBeVisible();
        });
    });
});