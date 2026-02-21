import { describe, it, expect } from 'vitest'
import { calculateCost, shouldShowCrossWeightWarning } from '../../src/utils/calculator'

describe('calculateCost', () => {
  it('calculates total cost correctly', () => {
    const result = calculateCost(6, 9.50)
    expect(result).toBe(57.00)
  })

  it('returns 0 for 0 skeins', () => {
    const result = calculateCost(0, 10)
    expect(result).toBe(0)
  })

  it('returns 0 for $0 price', () => {
    const result = calculateCost(5, 0)
    expect(result).toBe(0)
  })

  it('throws error for negative skeins', () => {
    const result = calculateCost(-1, 10)
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for negative price', () => {
    const result = calculateCost(5, -10)
    expect(result).toBeInstanceOf(Error)
  })
})

describe('shouldShowCrossWeightWarning', () => {
  it('shows warning for DK (3) to Bulky (5) - gap of 2', () => {
    const result = shouldShowCrossWeightWarning(3, 5)
    expect(result).toBe(true)
  })

  it('hides warning for DK (3) to Worsted (4) - gap of 1', () => {
    const result = shouldShowCrossWeightWarning(3, 4)
    expect(result).toBe(false)
  })

  it('shows warning for DK (3) to Lace (0) - gap of 3', () => {
    const result = shouldShowCrossWeightWarning(3, 0)
    expect(result).toBe(true)
  })

  it('hides warning for same weight', () => {
    const result = shouldShowCrossWeightWarning(4, 4)
    expect(result).toBe(false)
  })

  it('handles reversed order (substitute to pattern)', () => {
    const result = shouldShowCrossWeightWarning(5, 3)
    expect(result).toBe(true)
  })

  it('handles adjacent weights at boundary', () => {
    expect(shouldShowCrossWeightWarning(0, 1)).toBe(false) // Lace to Fingering
    expect(shouldShowCrossWeightWarning(6, 7)).toBe(false) // Super Bulky to Jumbo
    expect(shouldShowCrossWeightWarning(0, 2)).toBe(true) // Lace to Sport (gap of 2)
  })
})
