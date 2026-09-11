import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';

test('should log in successfully and display correct title', async ({ page }) => {
    
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(productsPage.logo).toBeVisible();
    await expect(productsPage.logo).toHaveText('Swag Labs');

});
