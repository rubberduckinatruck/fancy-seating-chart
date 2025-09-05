import React from 'react'
import { useSeatingStore } from '../../../state/store'

export default function StudentsSection() {
  const { state, actions } = useSeatingStore()
  const roster = state.roster.p1

  const toggleReq = (id: string, req: 'front'|'back'|undefined) => {
    const next = roster.map(s=> s.id===id ? { ...s, rowRequirement: req } : s)
    actions.setRoster('p1', next)
  }

  return (
    <div className="space-y-2 text-sm">
      {roster.map((s)=>(
        <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl border px-2 py-1">
          <span className="truncate">{s.name}</span>
          <div className="flex items-center gap-1">
            <select
              className="border rounded-lg px-2 py-1 text-xs"
              value={s.rowRequirement || ''}
              onChange={(e)=>toggleReq(s.id, e.target.value ? e.target.value as any : undefined)}
            >
              <option value="">No req.</option>
              <option value="front">Front row</option>
              <option value="back">Back row</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}