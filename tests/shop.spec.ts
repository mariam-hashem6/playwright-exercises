import { test, expect } from "@playwright/test";
import { HomePage, CustomerData } from "../pages/home.page";
import { ShopPage } from "../pages/shop.page";

const user: CustomerData = {
  name: "Maryam",
  email: "maryam@example.com",
  password: "Password123!",
  gender: "Female",
  lovesIceCream: true,
  employmentStatus: "Employed",
};

test(`fills the form with data and adds items to cart`, async ({ page }) => {
  
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);

  await homePage.open();
  await homePage.fillForm(user);
  await homePage.submitForm();
  await expect(homePage.successAlert).toBeVisible();
  await expect(homePage.successAlert).toContainText("Success!");

  await homePage.navigateToShop();
  await expect(page).toHaveURL(/.*shop/);
  await shopPage.addProductsToCart(["iphone X", "Blackberry"]);
  await expect(shopPage.checkoutButton).toContainText("2");
  
});
