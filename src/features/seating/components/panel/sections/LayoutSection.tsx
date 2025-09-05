import React from 'react'
import { DefaultTemplates } from '../../../state/template'
import { useSeatingStore } from '../../../state/store'

export default function LayoutSection() {
  const { state, actions } = useSeatingStore()

  return (
    <div className="space-y-2 text-sm">
      <div className="text-gray-600">Template:</div>
      <div className="flex flex-wrap gap-2">
        {DefaultTemplates.map(t=>(
          <button
            key={t.id}
            className={'px-3 py-1.5 rounded-xl border ' + (state.template.id===t.id ? 'bg-black text-white':'bg-white')}
            onClick={()=>actions.setTemplate(t)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Zones: first row = front, last row = back. Groups disable zones by default.
      </div>
    </div>
  )
}