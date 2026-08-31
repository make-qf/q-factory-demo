import { test, expect } from '@playwright/test';

test('Create new post button navigates to new post page', async ({ page }) => {
  // adjust host/port if your dev server runs elsewhere
  await page.goto('http://localhost:3000/blog');

  // Click the visible text for creating a new post
  await page.locator('text=Create a new post').click();

  // Expect navigation to the new post route and the heading to be visible
  await expect(page).toHaveURL(/\/blog\/new/);
  await expect(page.locator('text=Create a new post')).toBeVisible();
});
