import React, { useState } from 'react'
import RightPanelShell from './RightPanelShell'
import StudentsSection from './sections/StudentsSection'
import RulesSection from './sections/RulesSection'
import LayoutSection from './sections/LayoutSection'
import { useSeatingStore } from '../../state/store'
import { downloadPNGFromNode } from '../../lib/exportImage'

function Section({ title, open, onToggle, children }:{ title:string; open:boolean; onToggle:()=>void; children:React.ReactNode }) {
  return (
    <section className="mt-3 first:mt-0 px-4 py-3">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100">
        <span className="text-base font-semibold">{title}</span>
        <span className={'transition-transform ' + (open ? 'rotate-90':'' )}>▶</span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </section>
  )
}

export default function RightPanel() {
  const [openStudents, setOpenStudents] = useState(true)
  const [openRules, setOpenRules] = useState(false)
  const [openLayout, setOpenLayout] = useState(false)
  const { state, actions } = useSeatingStore()

  const handleDownload = async () => {
    const node = document.getElementById('chartCapture')
    if (!node) return
    await downloadPNGFromNode(node, (state.titles?.p1 || 'period_1') + '_seating')
  }

  return (
    <RightPanelShell>
      <Section title="Students" open={openStudents} onToggle={()=>setOpenStudents(v=>!v)}>
        <StudentsSection />
      </Section>
      <Section title="Rules" open={openRules} onToggle={()=>setOpenRules(v=>!v)}>
        <RulesSection />
      </Section>
      <Section title="Layout" open={openLayout} onToggle={()=>setOpenLayout(v=>!v)}>
        <LayoutSection />
      </Section>

      <div className="px-4 py-3 flex flex-col gap-2">
        <button className="btn" onClick={()=>actions.randomize('p1')}>Randomize</button>
        <button className="btn" onClick={()=>actions.sortAZ('p1')}>Sort A→Z</button>
        <button className="btn" onClick={handleDownload}>Download PNG</button>
        <button className="btn" onClick={()=>window.print()}>Print</button>
      </div>
    </RightPanelShell>
  )
}