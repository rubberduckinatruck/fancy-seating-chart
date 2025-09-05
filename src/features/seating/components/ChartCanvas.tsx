import React, { useRef, useState, useEffect } from 'react'
import { ROWS, COLS, type Fixture } from '../lib/types'
import { useSeatingStore } from '../state/store'
import { clsx } from 'clsx'

function Seat({ index, student, onDragStart, onDragOver, onDrop, mismatch } : {
  index: number
  student: { id: string; name: string } | null
  onDragStart: (i:number)=>void
  onDragOver: (e: React.DragEvent)=>void
  onDrop: (i:number)=>void
  mismatch?: boolean
}) {
  return (
    <div
      className={clsx('desk', mismatch && 'desk--mismatch')}
      draggable={!!student}
      onDragStart={()=>onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={()=>onDrop(index)}
    >
      <div className="text-xs text-gray-600">{student ? student.name : '—'}</div>
    </div>
  )
}

type DragState = { from: number|null }

export default function ChartCanvas({ title }: { title: string }) {
  const { state, actions } = useSeatingStore()
  const seats = state.seats.p1
  const roster = state.roster.p1
  const template = state.template

  function zoneForIndex(i: number): 'front'|'back'|undefined {
    const r = Math.floor(i / COLS)
    if (template.frontEdge==='top') {
      if (r===0) return 'front'
      if (r===ROWS-1) return 'back'
    } else if (template.frontEdge==='bottom') {
      if (r===0) return 'back'
      if (r===ROWS-1) return 'front'
    }
    return undefined
  }

  const [drag, setDrag] = useState<DragState>({ from: null })
  const onDragStart = (i:number)=> setDrag({ from: i })
  const onDragOver = (e:React.DragEvent)=> e.preventDefault()
  const onDrop = (i:number)=>{
    const from = drag.from
    if (from===null || from===i) return
    const a = seats[from]
    const b = seats[i]
    const next = seats.slice()
    next[i] = a
    next[from] = b
    actions.setSeats('p1', next)
    setDrag({ from: null })
  }

  const studentById = Object.fromEntries(roster.map(s=>[s.id, s]))
  const mismatches = seats.map((stu, i)=>{
    const z = zoneForIndex(i)
    if (!stu || !stu.id) return false
    const req = studentById[stu.id]?.rowRequirement
    if (!req) return false
    if (req==='front') return z!=='front'
    if (req==='back') return z!=='back'
    return false
  })

  const [fixtures, setFixtures] = useState<Fixture[]>([
    { id:'f1', type:'door', label:'Door', x: 660, y: 20, w: 60, h: 24, layer:'back' },
    { id:'f2', type:'window', label:'Window', x: -80, y: 100, w: 60, h: 24, layer:'back' },
    { id:'f3', type:'desk', label:'Teacher', x: 660, y: 180, w: 80, h: 40, layer:'back' },
  ])

  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragFx, setDragFx] = useState<{ id:string, startX:number, startY:number, baseX:number, baseY:number }|null>(null)

  useEffect(()=>{
    function onMove(e:MouseEvent){
      if (!dragFx) return
      const dx = e.clientX - dragFx.startX
      const dy = e.clientY - dragFx.startY
      setFixtures(prev=>prev.map(f=> f.id===dragFx.id ? { ...f, x: dragFx.baseX + dx, y: dragFx.baseY + dy } : f))
    }
    function onUp(){ setDragFx(null) }
    if (dragFx) {
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp, { once: true })
      return ()=>{
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
    }
  }, [dragFx])

  return (
    <div id="chartCapture" className="bg-white rounded-2xl shadow p-4 border mx-auto w-max relative" ref={canvasRef}>
      <div className="text-center text-xl font-semibold mb-2">{title}</div>
      <div className="text-center text-sm text-gray-500 mb-4">Front of classroom (top)</div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 8 }}>
        {Array.from({ length: ROWS*COLS }).map((_, i) => (
          <Seat
            key={i}
            index={i}
            student={seats[i]}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            mismatch={mismatches[i]}
          />
        ))}
      </div>

      <div aria-hidden className="pointer-events-none" style={{ position:'absolute', inset: 0 }}>
        {fixtures.map(f=>(
          <div
            key={f.id}
            className={
              'fixture ' +
              (f.type==='window' ? 'fixture--window' : f.type==='door' ? 'fixture--door' : 'fixture--desk')
            }
            style={{ left: f.x, top: f.y, width: f.w, height: f.h }}
          >
            <div
              className="pointer-events-auto w-full h-full flex items-center justify-center cursor-move"
              onMouseDown={(e)=> setDragFx({ id: f.id, startX: e.clientX, startY: e.clientY, baseX: f.x, baseY: f.y })}
              title="Drag to move"
            >
              {f.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}