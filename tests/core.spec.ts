import { test, expect } from '@playwright/test';

test.describe('Core Pages', () => {
  test('Homepage loads and has correct title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the title contains the site title
    // Using a regex to potentially match variations if the title is dynamic
    await expect(page).toHaveTitle(/\/home\/danny/);

    // Check if the main heading (h1) is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('RSS feed is accessible and returns XML', async ({ request }) => {
    const response = await request.get('/rss.xml');
    
    // Check if the response status is OK (200)
    expect(response.ok()).toBeTruthy();

    // Check if the content type is XML
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/xml');
  });
});