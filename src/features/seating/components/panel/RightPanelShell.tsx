import React from 'react'
export default function RightPanelShell({ children }: { children: React.ReactNode }) {
  return <aside className="seating-side-panel"><div className="seating-side-panel__body">{children}</div></aside>
}