import { clamp } from './utils'
import { describe, it, expect } from 'vitest'

describe('utils', () => {
  it('clamp clamps within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(99, 0, 10)).toBe(10)
  })
})