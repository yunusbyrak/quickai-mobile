import type { Note } from '@/types/note'
import type { Folder } from '@/types/folder'

/**
 * Search utility functions for filtering notes and folders
 */

export interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  searchFields?: (keyof Note)[]
}

export interface FolderSearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  searchFields?: (keyof Folder)[]
}

const DEFAULT_SEARCH_FIELDS: (keyof Note)[] = [
  'title',
  'summary',
  'tag',
  'folder_name',
  'type'
]

const DEFAULT_FOLDER_SEARCH_FIELDS: (keyof Folder)[] = [
  'title',
  'description'
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
  options: SearchOptions | FolderSearchOptions
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

/**
 * Search through a single folder
 */
export const searchFolder = (folder: Folder, query: string, options: FolderSearchOptions = {}): boolean => {
  if (!query.trim()) return true

  const searchFields = options.searchFields || DEFAULT_FOLDER_SEARCH_FIELDS

  return searchFields.some(field => {
    const fieldValue = folder[field]
    return fieldMatches(fieldValue, query, options)
  })
}

/**
 * Search through an array of folders
 */
export const searchFolders = (
  folders: Folder[],
  query: string,
  options: FolderSearchOptions = {}
): Folder[] => {
  if (!query.trim()) return folders

  return folders.filter(folder => searchFolder(folder, query, options))
}

/**
 * Get folder search suggestions based on existing folders
 */
export const getFolderSearchSuggestions = (
  folders: Folder[],
  query: string,
  maxSuggestions: number = 5
): string[] => {
  if (!query.trim() || query.length < 2) return []

  const suggestions = new Set<string>()
  const normalizedQuery = normalizeText(query)

  folders.forEach(folder => {
    // Add title suggestions
    if (folder.title && normalizeText(folder.title).includes(normalizedQuery)) {
      suggestions.add(folder.title)
    }

    // Add description suggestions
    if (folder.description && normalizeText(folder.description).includes(normalizedQuery)) {
      suggestions.add(folder.description)
    }
  })

  return Array.from(suggestions).slice(0, maxSuggestions)
}

/**
 * Advanced folder search with multiple terms
 */
export const advancedFolderSearch = (
  folders: Folder[],
  query: string,
  options: FolderSearchOptions = {}
): Folder[] => {
  if (!query.trim()) return folders

  // Split query into terms
  const terms = query.split(/\s+/).filter(term => term.length > 0)

  if (terms.length === 1) {
    return searchFolders(folders, terms[0], options)
  }

  // For multiple terms, find folders that match ALL terms
  return folders.filter(folder => {
    return terms.every(term => searchFolder(folder, term, options))
  })
}
