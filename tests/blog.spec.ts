import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test('Blog index page loads, has correct title/heading, and lists posts', async ({ page }) => {
    // Navigate to the blog index page
    await page.goto('/blog');

    // Check if the title contains 'Blog Posts'
    await expect(page).toHaveTitle(/Blog Posts/);

    // Check if the main heading (h1) is visible and contains 'Blog Posts'
    await expect(page.getByRole('heading', { level: 1, name: /Blog Posts/ })).toBeVisible();

    // Check if at least one blog post link is visible
    // Using a known slug from src/content/blog/sweat-the-small-things.md
    await expect(page.getByRole('link', { name: /Sweat the Small Things/i })).toBeVisible();
  });

  test('Individual blog post page loads and has correct title/heading', async ({ page }) => {
    const postSlug = 'sweat-the-small-things';
    const postTitle = 'Sweat the Small Things'; // From the frontmatter

    // Navigate to the specific blog post page
    await page.goto(`/blog/${postSlug}`);

    // Check if the title contains the post title
    await expect(page).toHaveTitle(new RegExp(postTitle));

    // Check if the main heading (h1) is visible and contains the post title
    await expect(page.getByRole('heading', { level: 1, name: new RegExp(postTitle) })).toBeVisible();
  });
});