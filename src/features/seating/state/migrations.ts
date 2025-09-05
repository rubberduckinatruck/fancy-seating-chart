export type NoteType = 'redirect'|'praise'|'contact'
export type Note = { id: string; timestamp: number; type: NoteType; text: string }
export type Student = { id: string; name: string; photo?: string; rowRequirement?: 'front'|'back'; tags?: string[]; notes?: Note[] }