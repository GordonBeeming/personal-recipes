import { test, expect } from '@playwright/test';
import path from 'path';

const screenshotDir = path.join(process.cwd(), 'docs', 'tasks', 'images');

test.describe('Recipe Website - Basic Functionality', () => {
  
  test('homepage loads and displays recipes', async ({ page }) => {
    await page.goto('/');
    
    // Wait for recipes to load
    await expect(page.getByRole('heading', { name: /Gordon's Recipe Collection/i })).toBeVisible();
    
    // Verify search and filters are present
    await expect(page.getByLabel(/search recipes/i)).toBeVisible();
    await expect(page.getByLabel(/filter by category/i)).toBeVisible();
    await expect(page.getByLabel(/filter by tag/i)).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    
    // Click theme toggle
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    
    // Wait for theme to change
    await page.waitForTimeout(500);
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Search for a recipe
    const searchInput = page.getByLabel(/search recipes/i);
    await searchInput.fill('chicken');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Verify results are filtered
    const resultCount = page.getByText(/showing \d+ of \d+ recipes/i);
    await expect(resultCount).toBeVisible();
  });

  test('recipe card is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first recipe card
    await page.keyboard.press('Tab'); // Theme toggle
    await page.keyboard.press('Tab'); // Search
    await page.keyboard.press('Tab'); // Category
    await page.keyboard.press('Tab'); // Tags  
    await page.keyboard.press('Tab'); // First recipe card
    
    // Press Enter to open recipe
    await page.keyboard.press('Enter');
    
    // Verify recipe detail page loads
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /back to recipes/i })).toBeVisible();
  });

  test('filters work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Select a category filter
    await page.getByLabel(/filter by category/i).click();
    await page.getByRole('option', { name: /dinner/i }).click();
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Verify filter is applied
    await expect(page.getByText(/showing \d+ of \d+ recipes/i)).toBeVisible();
  });

  test('responsive design - mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify elements are accessible on mobile
    await expect(page.getByRole('heading', { name: /Gordon's Recipe Collection/i })).toBeVisible();
    await expect(page.getByLabel(/search recipes/i)).toBeVisible();
  });

  test('responsive design - tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /Gordon's Recipe Collection/i })).toBeVisible();
  });
});
