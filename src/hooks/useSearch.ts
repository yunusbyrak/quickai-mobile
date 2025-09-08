import { useState, useEffect, useCallback, useRef } from 'react'

interface UseSearchOptions {
  debounceMs?: number
  minLength?: number
  onSearch?: (query: string) => void
}

interface UseSearchResult {
  query: string
  debouncedQuery: string
  setQuery: (query: string) => void
  clearSearch: () => void
  isSearching: boolean
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchResult => {
  const { debounceMs = 300, minLength = 0, onSearch } = options

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSearchingRef = useRef(false)

  // Debounce the search query
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If query is empty, immediately clear debounced query
    if (query.length === 0) {
      setDebouncedQuery('')
      setIsSearching(false)
      isSearchingRef.current = false
      onSearch?.('')
      return
    }

    // If query is too short, don't search
    if (query.length < minLength) {
      setDebouncedQuery('')
      setIsSearching(false)
      isSearchingRef.current = false
      return
    }

    // Set searching state
    setIsSearching(true)
    isSearchingRef.current = true

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
      isSearchingRef.current = false
      onSearch?.(query)
    }, debounceMs)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, debounceMs, minLength, onSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    setIsSearching(false)
    isSearchingRef.current = false
    onSearch?.('')
  }, [onSearch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    query,
    debouncedQuery,
    setQuery,
    clearSearch,
    isSearching
  }
}
