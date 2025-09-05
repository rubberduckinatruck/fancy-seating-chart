import type { Fixture } from '../lib/types'

export type Template = {
  id: string
  name: string
  version: number
  layoutMode: 'grid'|'snap'|'freeform'
  frontEdge: 'top'|'bottom'|'left'|'right'
  applyZoneTagsInGroups: boolean
  fixtures: Fixture[]
  formatLock?: boolean
}

export const DefaultTemplates: Template[] = [
  { id:'testing-36', name:'Testing (36 singles)', version:1, layoutMode:'grid', frontEdge:'top', applyZoneTagsInGroups:false, fixtures:[], formatLock:true },
  { id:'paired-rows', name:'Paired rows', version:1, layoutMode:'grid', frontEdge:'top', applyZoneTagsInGroups:false, fixtures:[], formatLock:true },
  { id:'groups-4', name:'Groups of 4', version:1, layoutMode:'grid', frontEdge:'top', applyZoneTagsInGroups:false, fixtures:[], formatLock:false },
]