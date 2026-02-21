import { describe, it, expect } from 'vitest'
import { convertUnits } from '../../src/utils/calculator'

describe('convertUnits', () => {
  it('converts 1000 yards to meters', () => {
    const result = convertUnits(1000, 'yards', 'meters')
    expect(result).toBe(914.4)
  })

  it('converts 0 yards to meters as exactly 0', () => {
    const result = convertUnits(0, 'yards', 'meters')
    expect(result).toBe(0)
  })

  it('converts 10 inches to cm', () => {
    const result = convertUnits(10, 'inches', 'cm')
    expect(result).toBe(25.4)
  })

  it('converts meters to yards', () => {
    const result = convertUnits(914.4, 'meters', 'yards')
    expect(result).toBeCloseTo(1000, 1)
  })

  it('converts cm to inches', () => {
    const result = convertUnits(25.4, 'cm', 'inches')
    expect(result).toBe(10)
  })

  it('returns same value when units are equal', () => {
    const result = convertUnits(100, 'yards', 'yards')
    expect(result).toBe(100)
  })

  it('throws error for negative values', () => {
    const result = convertUnits(-100, 'yards', 'meters')
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for unsupported conversion', () => {
    const result = convertUnits(100, 'yards', 'inches')
    expect(result).toBeInstanceOf(Error)
  })

  it('handles case-insensitive unit names', () => {
    const result = convertUnits(1000, 'YARDS', 'METERS')
    expect(result).toBe(914.4)
  })
})
