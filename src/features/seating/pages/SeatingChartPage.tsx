import React from 'react'
import HeaderBar from '../components/header/HeaderBar'
import RightPanel from '../components/panel/RightPanel'
import ChartCanvas from '../components/ChartCanvas'
import { useSeatingStore } from '../state/store'

export default function SeatingChartPage() {
  const { state } = useSeatingStore()
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 app-with-fixed-panel">
      <HeaderBar title="Fancy Seating Chart" activePeriod="p1" />
      <main className="px-4 py-6 max-w-6xl mx-auto">
        <ChartCanvas title={state.titles.p1 + ' — Seating Chart'} />
      </main>
      <RightPanel />
    </div>
  )
}