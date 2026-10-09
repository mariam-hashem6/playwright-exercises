import { expect, test } from "@playwright/test";
import { RegisterApi } from "../api/registration-api";
import { LoginApi } from "../api/login-api";
import { DashboardPage } from "../pages/client/dashboard.page";
import { CartPage } from "../pages/client/cart.page";
import { OrdersPage } from "../pages/orders.page";
import { OrderPage } from "../pages/order.page";
import { CheckoutPage } from "../pages/checkout.page";
import { createRegistrationUser, loadJson } from "../utils/test-data-helper";
import { TokenHelper } from "../utils/token-helper";
import { User } from "../types/user";
import { CheckoutDetails } from "../types/checkout-details";
import type { ProductCase } from "../types/product-case";

test.describe('Automated Product Checkout E2E Flow', () => {
    const user = loadJson<User>("users-data.json");
    const checkoutDetails = loadJson<CheckoutDetails>("checkout-data.json");
    const productCases = loadJson<ProductCase[]>("product-cases.json");
    const products = productCases.flatMap(productCase => productCase.products);

    test.beforeEach(async ({ page }) => {
        const registerApi = await RegisterApi.create();
        const loginApi = await LoginApi.create();

        try {
            const userWithUpdatedEmail = createRegistrationUser(user);
            await registerApi.register(userWithUpdatedEmail);

            const token = await loginApi.login({
                name: 'registered user',
                userEmail: userWithUpdatedEmail.email,
                userPassword: userWithUpdatedEmail.password,
                expectedResult: 'success',
            });

            await TokenHelper.inject(page, token);
            await page.goto('/client');
            await expect(page).toHaveURL(/\/dashboard\/dash/);
        } finally {
            await registerApi.dispose();
            await loginApi.dispose();
        }
    });

    test(`validate that ${products.length} products can be ordered`, async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const cartPage = new CartPage(page);
        const ordersPage = new OrdersPage(page);
        const orderPage = new OrderPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('add the products to the cart', async () => {
            await dashboardPage.addProductsToCart(products);
            await dashboardPage.expectCartItemCount(products.length);
            await dashboardPage.goToCart();
            await expect(page).toHaveURL(/\/client\/#\/dashboard\/cart$/);
            await cartPage.expectProductsInCart(products);
        });

        await test.step('complete checkout', async () => {
            await cartPage.proceedToCheckout();
            await expect(page).toHaveURL(/\/client\/#\/dashboard\/order(?:[/?].*)?$/);
            await checkoutPage.fillCardInfo(checkoutDetails);
            await checkoutPage.placeOrder();
            await checkoutPage.expectOrderPlaced();
        });

        await test.step('verify the latest order details', async () => {
            await ordersPage.openOrders();
            const lastOrderId = await ordersPage.getLastOrderId();
            await ordersPage.viewOrder(lastOrderId);
            await orderPage.expectOrderId(lastOrderId);
        });
    });
});