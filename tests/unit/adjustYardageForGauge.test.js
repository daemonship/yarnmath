import { describe, it, expect } from 'vitest'
import { adjustYardageForGauge } from '../../src/utils/calculator'

describe('adjustYardageForGauge', () => {
  it('adjusts yardage for tighter gauge (20 vs 18 stitches)', () => {
    const result = adjustYardageForGauge(1000, 18, 20)
    // 1000 × 20/18 = 1111.11...
    expect(result).toBeCloseTo(1111.1, 0)
  })

  it('adjusts yardage for looser gauge (16 vs 20 stitches)', () => {
    const result = adjustYardageForGauge(1000, 20, 16)
    // 1000 × 16/20 = 800
    expect(result).toBe(800)
  })

  it('returns same yardage when gauges are equal', () => {
    const result = adjustYardageForGauge(1000, 18, 18)
    expect(result).toBe(1000)
  })

  it('throws error for zero pattern gauge', () => {
    const result = adjustYardageForGauge(1000, 0, 18)
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for zero substitute gauge', () => {
    const result = adjustYardageForGauge(1000, 18, 0)
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for negative pattern yardage', () => {
    const result = adjustYardageForGauge(-100, 18, 20)
    expect(result).toBeInstanceOf(Error)
  })

  it('throws error for negative gauge values', () => {
    const result = adjustYardageForGauge(1000, -18, 20)
    expect(result).toBeInstanceOf(Error)
  })

  it('handles decimal gauge values', () => {
    const result = adjustYardageForGauge(500, 16.5, 18.5)
    expect(result).toBeCloseTo(560.6, 1)
  })
})
