import React from 'react'

export default function HeaderBar({ title, activePeriod }: { title: string; activePeriod: string }) {
  return (
    <header className="seating-toolbar bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">Active: {activePeriod}</div>
      </div>
    </header>
  )
}