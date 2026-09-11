import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
 
readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByText('Swag Labs')
  }
}