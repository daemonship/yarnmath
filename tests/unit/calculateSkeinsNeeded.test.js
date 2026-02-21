import { describe, it, expect } from 'vitest'
import { calculateSkeinsNeeded } from '../../src/utils/calculator'

describe('calculateSkeinsNeeded', () => {
  it('calculates 6 skeins for 1200 yards with 220 yards per skein', () => {
    const result = calculateSkeinsNeeded(1200, 220)
    expect(result.skeins).toBe(6)
    expect(result.totalYardage).toBe(1320)
    expect(result.surplus).toBe(120)
  })

  it('returns 0 skeins for 0 pattern yardage', () => {
    const result = calculateSkeinsNeeded(0, 220)
    expect(result.skeins).toBe(0)
    expect(result.totalYardage).toBe(0)
    expect(result.surplus).toBe(0)
  })

  it('throws error for zero skein yardage (division by zero)', () => {
    const result = calculateSkeinsNeeded(1200, 0)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toContain('zero')
  })

  it('throws error for negative pattern yardage', () => {
    const result = calculateSkeinsNeeded(-100, 220)
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for negative skein yardage', () => {
    const result = calculateSkeinsNeeded(100, -50)
    expect(result).toBeInstanceOf(Error)
  })

  it('calculates exact division correctly', () => {
    const result = calculateSkeinsNeeded(500, 250)
    expect(result.skeins).toBe(2)
    expect(result.totalYardage).toBe(500)
    expect(result.surplus).toBe(0)
  })

  it('always rounds up to whole skeins', () => {
    const result = calculateSkeinsNeeded(100, 220)
    expect(result.skeins).toBe(1)
    expect(result.totalYardage).toBe(220)
    expect(result.surplus).toBe(120)
  })
})
