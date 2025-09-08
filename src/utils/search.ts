import type { Note } from '@/types/note'

/**
 * Search utility functions for filtering notes
 */

export interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  searchFields?: (keyof Note)[]
}

const DEFAULT_SEARCH_FIELDS: (keyof Note)[] = [
  'title',
  'summary',
  'tag',
  'folder_name',
  'type'
]

/**
 * Normalize text for search comparison
 */
const normalizeText = (text: string, caseSensitive: boolean = false): string => {
  if (!text) return ''
  return caseSensitive ? text.trim() : text.trim().toLowerCase()
}

/**
 * Check if a single field matches the search query
 */
const fieldMatches = (
  fieldValue: any,
  query: string,
  options: SearchOptions
): boolean => {
  if (!fieldValue || !query) return false

  const normalizedField = normalizeText(String(fieldValue), options.caseSensitive)
  const normalizedQuery = normalizeText(query, options.caseSensitive)

  if (options.exactMatch) {
    return normalizedField === normalizedQuery
  }

  return normalizedField.includes(normalizedQuery)
}

/**
 * Search through a single note
 */
export const searchNote = (note: Note, query: string, options: SearchOptions = {}): boolean => {
  if (!query.trim()) return true

  const searchFields = options.searchFields || DEFAULT_SEARCH_FIELDS

  return searchFields.some(field => {
    const fieldValue = note[field]
    return fieldMatches(fieldValue, query, options)
  })
}

/**
 * Search through an array of notes
 */
export const searchNotes = (
  notes: Note[],
  query: string,
  options: SearchOptions = {}
): Note[] => {
  if (!query.trim()) return notes

  return notes.filter(note => searchNote(note, query, options))
}

/**
 * Highlight search terms in text (for future use in search results)
 */
export const highlightSearchTerms = (
  text: string,
  query: string,
  options: SearchOptions = {}
): string => {
  if (!text || !query) return text

  const normalizedText = normalizeText(text, options.caseSensitive)
  const normalizedQuery = normalizeText(query, options.caseSensitive)

  if (!normalizedText.includes(normalizedQuery)) return text

  // For now, just return the original text
  // In the future, this could return JSX with highlighted terms
  return text
}

/**
 * Get search suggestions based on existing notes
 */
export const getSearchSuggestions = (
  notes: Note[],
  query: string,
  maxSuggestions: number = 5
): string[] => {
  if (!query.trim() || query.length < 2) return []

  const suggestions = new Set<string>()
  const normalizedQuery = normalizeText(query)

  notes.forEach(note => {
    // Add title suggestions
    if (note.title && normalizeText(note.title).includes(normalizedQuery)) {
      suggestions.add(note.title)
    }

    // Add tag suggestions
    if (note.tag && normalizeText(note.tag).includes(normalizedQuery)) {
      suggestions.add(note.tag)
    }

    // Add folder name suggestions
    if (note.folder_name && normalizeText(note.folder_name).includes(normalizedQuery)) {
      suggestions.add(note.folder_name)
    }
  })

  return Array.from(suggestions).slice(0, maxSuggestions)
}

/**
 * Advanced search with multiple terms
 */
export const advancedSearch = (
  notes: Note[],
  query: string,
  options: SearchOptions = {}
): Note[] => {
  if (!query.trim()) return notes

  // Split query into terms
  const terms = query.split(/\s+/).filter(term => term.length > 0)

  if (terms.length === 1) {
    return searchNotes(notes, terms[0], options)
  }

  // For multiple terms, find notes that match ALL terms
  return notes.filter(note => {
    return terms.every(term => searchNote(note, term, options))
  })
}
