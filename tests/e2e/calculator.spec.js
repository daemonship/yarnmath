/* eslint-env node */
import { test, expect } from '@playwright/test'

const APP_URL = process.env.APP_URL || 'http://localhost:5173'

/**
 * E2E Scenario 1: Basic yardage calculation produces correct results
 */
test.describe('Basic yardage calculation', () => {
  test('produces correct results', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Enter pattern yardage: 1200 yards
    await page.fill('input[name="patternYardage"]', '1200')
    
    // Enter substitute skein yardage: 220 yards
    await page.fill('input[name="skeinYardage"]', '220')
    
    // Enter price per skein: $9.50
    await page.fill('input[name="pricePerSkein"]', '9.50')
    
    // Click calculate
    await page.click('button[type="submit"]')
    
    // Assert results panel is visible
    const resultsPanel = page.locator('[data-testid="results-panel"]')
    await expect(resultsPanel).toBeVisible()
    
    // Assert skeins needed displays 6
    await expect(page.locator('[data-testid="skeins-needed"]')).toHaveText('6')
    
    // Assert total yardage displays 1320
    await expect(page.locator('[data-testid="total-yardage"]')).toHaveText('1320')
    
    // Assert surplus yardage displays 120
    await expect(page.locator('[data-testid="surplus-yardage"]')).toHaveText('120')
    
    // Assert cost estimate displays $57.00
    await expect(page.locator('[data-testid="cost-estimate"]')).toHaveText('$57.00')
  })
})

/**
 * E2E Scenario 2: Gauge adjustment changes skeins needed in both directions
 */
test.describe('Gauge adjustment', () => {
  test('adjusts skeins for tighter gauge', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Enter pattern yardage: 1000 yards, pattern gauge: 18 stitches per 4 inches
    await page.fill('input[name="patternYardage"]', '1000')
    await page.fill('input[name="patternGauge"]', '18')
    
    // Enter substitute skein yardage: 220 yards, substitute gauge: 20 stitches per 4 inches
    await page.fill('input[name="skeinYardage"]', '220')
    await page.fill('input[name="substituteGauge"]', '20')
    
    // Click calculate
    await page.click('button[type="submit"]')
    
    // Assert adjusted yardage is approximately 1111 yards
    await expect(page.locator('[data-testid="adjusted-yardage"]')).toHaveText(/1111/)
    
    // Assert skeins needed displays 6
    await expect(page.locator('[data-testid="skeins-needed"]')).toHaveText('6')
  })

  test('adjusts skeins for looser gauge', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Enter pattern yardage: 1000 yards, pattern gauge: 18 stitches per 4 inches
    await page.fill('input[name="patternYardage"]', '1000')
    await page.fill('input[name="patternGauge"]', '18')
    
    // Enter substitute skein yardage: 220 yards, substitute gauge: 16 stitches per 4 inches
    await page.fill('input[name="skeinYardage"]', '220')
    await page.fill('input[name="substituteGauge"]', '16')
    
    // Click calculate
    await page.click('button[type="submit"]')
    
    // Assert adjusted yardage is approximately 889 yards
    await expect(page.locator('[data-testid="adjusted-yardage"]')).toHaveText(/889/)
    
    // Assert skeins needed displays 5
    await expect(page.locator('[data-testid="skeins-needed"]')).toHaveText('5')
  })
})

/**
 * E2E Scenario 3: Empty and invalid input shows validation errors
 */
test.describe('Validation errors', () => {
  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Click calculate without entering any values
    await page.click('button[type="submit"]')
    
    // Assert validation errors appear for required fields
    await expect(page.locator('[data-testid="error-pattern-yardage"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-skein-yardage"]')).toBeVisible()
    
    // Assert results panel is NOT visible
    await expect(page.locator('[data-testid="results-panel"]')).not.toBeVisible()
  })

  test('shows error for zero skein yardage', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Enter 0 for substitute skein yardage and 1200 for pattern yardage
    await page.fill('input[name="patternYardage"]', '1200')
    await page.fill('input[name="skeinYardage"]', '0')
    
    // Click calculate
    await page.click('button[type="submit"]')
    
    // Assert an error message about invalid skein yardage appears
    await expect(page.locator('[data-testid="error-skein-yardage"]')).toContainText(/zero|invalid|cannot/i)
    
    // Assert no NaN or Infinity in results
    const resultsPanel = page.locator('[data-testid="results-panel"]')
    await expect(resultsPanel).not.toBeVisible()
  })
})

/**
 * E2E Scenario 4: Unit toggle preserves results correctness
 */
test.describe('Unit toggle', () => {
  test('preserves results after toggling units', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Enter pattern yardage: 1000 yards, skein yardage: 200 yards
    await page.fill('input[name="patternYardage"]', '1000')
    await page.fill('input[name="skeinYardage"]', '200')
    
    // Click calculate
    await page.click('button[type="submit"]')
    
    // Assert skeins needed is 5
    await expect(page.locator('[data-testid="skeins-needed"]')).toHaveText('5')
    
    // Toggle to metric
    await page.click('button[data-testid="toggle-units"]')
    
    // Assert pattern yardage shows approximately 914 meters
    await expect(page.locator('input[name="patternYardage"]')).toHaveValue(/914/)
    
    // Assert skein yardage shows approximately 183 meters
    await expect(page.locator('input[name="skeinYardage"]')).toHaveValue(/183/)
    
    // Assert skeins needed is still 5
    await expect(page.locator('[data-testid="skeins-needed"]')).toHaveText('5')
    
    // Toggle back to imperial
    await page.click('button[data-testid="toggle-units"]')
    
    // Verify values round-trip to original within 0.1
    await expect(page.locator('input[name="patternYardage"]')).toHaveValue(/1000/)
    await expect(page.locator('input[name="skeinYardage"]')).toHaveValue(/200/)
  })
})

/**
 * E2E Scenario 5: Cross-weight warning boundary at exactly 2 categories apart
 */
test.describe('Cross-weight warning', () => {
  test('shows warning for 2 category gap', async ({ page }) => {
    await page.goto(APP_URL)
    
    // Select pattern yarn weight: DK (3)
    await page.selectOption('select[name="patternWeight"]', '3')
    
    // Select substitute yarn weight: Bulky (5)
    await page.selectOption('select[name="substituteWeight"]', '5')
    
    // Assert cross-weight warning banner IS visible (gap of 2)
    await expect(page.locator('[data-testid="cross-weight-warning"]')).toBeVisible()
    
    // Change substitute yarn weight to Worsted (4)
    await page.selectOption('select[name="substituteWeight"]', '4')
    
    // Assert cross-weight warning banner is NOT visible (gap of 1)
    await expect(page.locator('[data-testid="cross-weight-warning"]')).not.toBeVisible()
    
    // Change substitute yarn weight to Lace (0)
    await page.selectOption('select[name="substituteWeight"]', '0')
    
    // Assert cross-weight warning banner IS visible (gap of 3)
    await expect(page.locator('[data-testid="cross-weight-warning"]')).toBeVisible()
  })
})
