import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

test.describe('BW Intel Fact Sheet E2E', () => {
  test('Search for city (Manila) and show fact sheet', async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill('input[placeholder*="Enter any city"]', 'Manila');
    await page.click('button:has-text("Research")');
    // Wait for AI progress or result panel
    await page.waitForTimeout(2500);
    await expect(page.locator('text=Manila')).toBeVisible();
    await expect(page.locator('text=Population').first()).toBeVisible();
  });

  test('Search for company (Ayala Corporation) and show entity results', async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill('input[placeholder*="Enter any city"]', 'Ayala Corporation');
    await page.click('button:has-text("Research")');
    await page.waitForTimeout(2500);
    await expect(page.locator('text=Ayala Corporation').first()).toBeVisible();
  });

  test('Search for person (Mayor John Doe) and render Person Card', async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill('input[placeholder*="Enter any city"]', 'Mayor John Doe');
    await page.click('button:has-text("Research")');
    await page.waitForTimeout(2500);
    // Person card may show 'No Photo' if none available
    await expect(page.locator('text=No Photo').first()).toBeVisible();
  });
});