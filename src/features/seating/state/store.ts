import { create } from 'zustand'
import type { Student } from './migrations'
import type { PeriodKey } from '../lib/types'
import { ROWS, COLS } from '../lib/types'
import { DefaultTemplates, type Template } from './template'
import { nanoid } from 'nanoid'

type Seats = (Student|null)[]
type SeatingState = {
  titles: Record<PeriodKey, string>
  template: Template
  seats: Record<PeriodKey, Seats>
  roster: Record<PeriodKey, Student[]>
}
type SeatingActions = {
  setTemplate: (t: Template) => void
  setSeats: (k: PeriodKey, seats: Seats) => void
  setRoster: (k: PeriodKey, students: Student[]) => void
  randomize: (k: PeriodKey) => void
  sortAZ: (k: PeriodKey) => void
  addNote: (k: PeriodKey, studentId: string, type: 'redirect'|'praise'|'contact', text: string) => void
}

function defaultRoster(): Student[] {
  return Array.from({length: 18}).map((_,i)=>({ id: 's'+i, name: `Student ${i+1}` }))
}
function emptySeats(): Seats { return Array.from({ length: ROWS*COLS }, () => null) }

function deriveZones(i: number, front: Template['frontEdge']): 'front'|'back'|undefined {
  const r = Math.floor(i / COLS)
  const c = i % COLS
  if (front==='top') { if (r===0) return 'front'; if (r===ROWS-1) return 'back' }
  else if (front==='bottom') { if (r===0) return 'back'; if (r===ROWS-1) return 'front' }
  else if (front==='left') { if (c===0) return 'front'; if (c===COLS-1) return 'back' }
  else { if (c===0) return 'back'; if (c===COLS-1) return 'front' }
  return undefined
}

export const useSeatingStore = create<{ state: SeatingState; actions: SeatingActions }>((set, get)=>({
  state: {
    titles: { p1:'Period 1', p3:'Period 3', p4:'Period 4', p5:'Period 5', p6:'Period 6' },
    template: DefaultTemplates[1],
    seats: { p1: emptySeats(), p3: emptySeats(), p4: emptySeats(), p5: emptySeats(), p6: emptySeats() },
    roster: { p1: defaultRoster(), p3: defaultRoster(), p4: defaultRoster(), p5: defaultRoster(), p6: defaultRoster() },
  },
  actions: {
    setTemplate(t) { set(s=>({ state: { ...s.state, template: t }})) },
    setSeats(k, seats) { set(s=>({ state: { ...s.state, seats: { ...s.state.seats, [k]: seats }}})) },
    setRoster(k, students) { set(s=>({ state: { ...s.state, roster: { ...s.state.roster, [k]: students }}})) },
    sortAZ(k) {
      const { state } = get()
      const seats = (state.seats[k] || []).slice()
      const people = seats.filter(Boolean) as Student[]
      people.sort((a,b)=>a.name.localeCompare(b.name))
      const out = Array.from({length: seats.length}, ()=>null) as Seats
      for (let i=0;i<people.length && i<out.length;i++) out[i]=people[i]
      set(s=>({ state: { ...s.state, seats: { ...s.state.seats, [k]: out }}}))
    },
    randomize(k) {
      const { state } = get()
      const seats = emptySeats()
      const roster = (state.roster[k] || []).slice()
      const frontSeatIdxs:number[] = []
      const backSeatIdxs:number[] = []
      const otherSeatIdxs:number[] = []
      for (let i=0;i<ROWS*COLS;i++) {
        const zone = deriveZones(i, state.template.frontEdge)
        if (zone==='front') frontSeatIdxs.push(i)
        else if (zone==='back') backSeatIdxs.push(i)
        else otherSeatIdxs.push(i)
      }
      const frontReq: Student[] = []
      const backReq: Student[] = []
      const neutral: Student[] = []
      for (const s of roster) {
        if (s.rowRequirement==='front') frontReq.push(s)
        else if (s.rowRequirement==='back') backReq.push(s)
        else neutral.push(s)
      }
      let idx=0
      for (const s of frontReq) {
        if (idx < frontSeatIdxs.length) seats[frontSeatIdxs[idx++]] = s
        else neutral.unshift(s)
      }
      idx=0
      for (const s of backReq) {
        if (idx < backSeatIdxs.length) seats[backSeatIdxs[idx++]] = s
        else neutral.unshift(s)
      }
      const empties = seats.map((v,i)=>v?null:i).filter(v=>v!==null) as number[]
      let n=0
      for (const s of neutral) {
        if (n<empties.length) seats[empties[n++]] = s
      }
      set(s=>({ state: { ...s.state, seats: { ...s.state.seats, [k]: seats }}}))
    },
    addNote(k, studentId, type, text) {
      set(s=>{
        const roster = (s.state.roster[k]||[]).map(stu=>{
          if (stu.id!==studentId) return stu
          const notes = (stu.notes||[]).concat({ id: nanoid(), timestamp: Date.now(), type, text })
          return { ...stu, notes }
        })
        return { state: { ...s.state, roster: { ...s.state.roster, [k]: roster } } }
      })
    }
  }
}))