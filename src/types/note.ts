import { Database } from './database'

// Database note type from schema
export type DatabaseNote = Database['public']['Tables']['notes']['Row']

// Extended note type for UI display with computed fields
export type Note = DatabaseNote & {
  // Computed display fields
  displayDate?: string
  displayTime?: string
  tag?: string
  description?: string
  // Associated data that might be joined
  folder_name?: string
}

// Note status from database enum
export type NoteStatus = Database['public']['Enums']['note_status']

// Note type from database enum
export type NoteType = Database['public']['Enums']['note_type']

// Props for note components
export interface NoteItemProps {
  note: Note
  onPress?: (note: Note) => void
  variant?: 'list' | 'grid'
  className?: string
}

export interface NotesListProps {
  notes: Note[]
  onNotePress?: (note: Note) => void
  isGridView?: boolean
  className?: string
  emptyState?: React.ReactNode
}
