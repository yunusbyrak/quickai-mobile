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

// Audio transcription types
export interface AudioTranscriptionSegment {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  temperature: number
  avg_logprob: number
  compression_ratio: number
  no_speech_prob: number
}

export interface AudioTranscriptionResponse {
  text: string
  language: string
  duration: number
  segments: AudioTranscriptionSegment[]
}

export interface AudioSummary {
  id: string
  note_id: string
  user_id: string
  link: string | null
  transcript: string | null
  segments: AudioTranscriptionSegment[] | null
  status: 'running' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface TranscribeAudioRequest {
  audioFile?: File
  audioUrl?: string
}

export interface TranscribeAudioResponse {
  id: string
  noteId: string
  status: 'running' | 'completed' | 'failed'
  message: string
}
