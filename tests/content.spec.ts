import { test, expect } from '@playwright/test';

test.describe('Content Pages', () => {
  test('About page loads and has correct title/heading', async ({ page }) => {
    // Navigate to the about page
    await page.goto('/about');

    // Check if the title contains 'About'
    await expect(page).toHaveTitle(/About/);

    // Check if the main heading (h1) is visible and contains 'About'
    // Assuming the title is used as the main heading
    await expect(page.getByRole('heading', { level: 1, name: /About/ })).toBeVisible();
  });

  // Add tests for other static content pages here if any are created later
});