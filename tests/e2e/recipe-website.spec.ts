import { test, expect } from '@playwright/test';
import path from 'path';

const screenshotDir = path.join(__dirname, '../screenshots');

test.describe('Recipe Website - Basic Functionality', () => {
  
  test('homepage loads and displays recipes', async ({ page }) => {
    await page.goto('/');
    
    // Wait for recipes to load
    await expect(page.getByRole('heading', { name: /Gordon's Recipe Collection/i })).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'homepage-light.png'), fullPage: true });
    
    // Verify search and filters are present
    await expect(page.getByLabel(/search recipes/i)).toBeVisible();
    await expect(page.getByLabel(/filter by category/i)).toBeVisible();
    await expect(page.getByLabel(/filter by tag/i)).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    
    // Take light mode screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'before-dark-mode.png'), fullPage: true });
    
    // Click theme toggle
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    
    // Wait for theme to change
    await page.waitForTimeout(500);
    
    // Take dark mode screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'after-dark-mode.png'), fullPage: true });
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Take before search screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'before-search.png'), fullPage: true });
    
    // Search for a recipe
    const searchInput = page.getByLabel(/search recipes/i);
    await searchInput.fill('chicken');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Take after search screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'after-search.png'), fullPage: true });
    
    // Verify results are filtered
    const resultCount = page.getByText(/showing \d+ of \d+ recipes/i);
    await expect(resultCount).toBeVisible();
  });

  test('recipe card is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first recipe card
    await page.keyboard.press('Tab'); // Skip to content
    await page.keyboard.press('Tab'); // Theme toggle
    await page.keyboard.press('Tab'); // Search
    await page.keyboard.press('Tab'); // Category
    await page.keyboard.press('Tab'); // Tags
    await page.keyboard.press('Tab'); // First recipe card
    
    // Take screenshot showing focus
    await page.screenshot({ path: path.join(screenshotDir, 'keyboard-focus.png'), fullPage: true });
    
    // Press Enter to open recipe
    await page.keyboard.press('Enter');
    
    // Verify recipe detail page loads
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /back to recipes/i })).toBeVisible();
    
    // Take screenshot of recipe detail
    await page.screenshot({ path: path.join(screenshotDir, 'recipe-detail.png'), fullPage: true });
  });

  test('filters work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Take before filter screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'before-filter.png'), fullPage: true });
    
    // Select a category filter
    await page.getByLabel(/filter by category/i).click();
    await page.getByRole('option', { name: /dinner/i }).click();
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Take after filter screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'after-category-filter.png'), fullPage: true });
    
    // Verify filter is applied
    await expect(page.getByText(/showing \d+ of \d+ recipes/i)).toBeVisible();
  });

  test('responsive design - mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Take mobile screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-view.png'), fullPage: true });
    
    // Verify elements are accessible on mobile
    await expect(page.getByRole('heading', { name: /Gordon's Recipe Collection/i })).toBeVisible();
    await expect(page.getByLabel(/search recipes/i)).toBeVisible();
  });

  test('responsive design - tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Take tablet screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'tablet-view.png'), fullPage: true });
  });
});
