export const ROWS = 6
export const COLS = 6
export type PeriodKey = 'p1'|'p3'|'p4'|'p5'|'p6'

export type FixtureType = 'door'|'window'|'desk'
export type Fixture = {
  id: string
  type: FixtureType
  label: string
  x: number
  y: number
  w: number
  h: number
  rotation?: number
  locked?: boolean
  layer?: 'back'|'front'
}