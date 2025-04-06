import { test, expect } from '@playwright/test';

test.describe('Tag Pages', () => {
  test('Tag page (/tags/opinion) loads, has correct title/heading, and lists relevant posts', async ({ page }) => {
    const tag = 'opinion';
    const formattedTag = 'Opinion'; // Capitalized version for display
    const expectedTitle = `Posts tagged with "${formattedTag}"`;
    const expectedHeading = `Posts tagged with "${formattedTag}"`;
    const expectedPostTitle = /Migrating to Hugo/i; // A post known to have the 'opinion' tag

    // Navigate to the tag page
    await page.goto(`/tags/${tag}`);

    // Check if the title matches
    await expect(page).toHaveTitle(new RegExp(expectedTitle));

    // Check if the main heading (h1) is visible and matches
    await expect(page.getByRole('heading', { level: 1, name: new RegExp(expectedHeading) })).toBeVisible();

    // Check if at least one relevant blog post link is visible
    await expect(page.getByRole('link', { name: expectedPostTitle })).toBeVisible();
  });

  // Add tests for other tag pages or edge cases (e.g., tags with no posts) here later
});