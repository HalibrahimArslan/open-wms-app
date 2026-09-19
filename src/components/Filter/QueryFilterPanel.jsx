import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router'

/**
 * Generic filter manager that owns URL query params.
 *
 * Props:
 * - initialFilters: default values when URL doesn't have a key
 * - filterKeys: optional explicit list of keys to manage
 * - onFiltersChange: callback when user applies/changes filters
 * - autoApply: if true, apply URL changes on every setFilter
 * - syncToUrl: if false, component only manages internal state
 * - serialize(key, value): convert UI value to string for URL
 * - deserialize(key, string): convert URL string to UI value
 * - children: render prop or node
 */
export default function QueryFilterPanel({
  initialFilters = {},
  filterKeys,
  onFiltersChange,
  autoApply = false,
  syncToUrl = true,
  preserveInitialOnEmpty = false,
  serialize,
  deserialize,
  children,
  urlMode = 'query',
  basePath,
  paramsString,
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchParamsKey = urlMode === 'path' ? paramsString || '' : searchParams.toString()

  const initialValuesKey = React.useMemo(() => JSON.stringify(initialFilters || {}), [initialFilters])

  const parseKeys = React.useMemo(() => {
    if (Array.isArray(filterKeys) && filterKeys.length > 0) return filterKeys
    const initKeys = Object.keys(initialFilters || {})
    if (initKeys.length > 0) return initKeys
    return []
  }, [filterKeys, initialFilters])

  const parsedSearchParams = React.useMemo(() => new URLSearchParams(searchParamsKey), [searchParamsKey])

  const parseValue = React.useCallback(
    (key, raw) => {
      if (raw === null || raw === undefined) return ''
      if (typeof deserialize === 'function') return deserialize(key, raw)
      return raw
    },
    [deserialize]
  )

  const stringifyValue = React.useCallback(
    (key, value) => {
      if (value === '' || value === null || value === undefined) return ''
      if (typeof serialize === 'function') return serialize(key, value)
      return String(value)
    },
    [serialize]
  )

  const computeInitial = React.useCallback(() => {
    const keysFromUrl = Array.from(parsedSearchParams.keys())
    const keys = parseKeys.length > 0 ? parseKeys : keysFromUrl
    const next = {}

    keys.forEach((key) => {
      const fromUrl = syncToUrl ? parsedSearchParams.get(key) : null
      const fallback = initialFilters[key] ?? ''
      next[key] = fromUrl !== null ? parseValue(key, fromUrl) : fallback
    })

    return next
  }, [initialFilters, parseKeys, parseValue, parsedSearchParams, syncToUrl])

  const [filters, setFilters] = React.useState(() => computeInitial())

  React.useEffect(() => {
    if (!syncToUrl) return
    setFilters(computeInitial())
  }, [computeInitial, searchParamsKey, initialValuesKey, syncToUrl])

  const applyFilters = React.useCallback(
    (nextFilters = filters) => {
      const effectiveFilters = { ...nextFilters }
      if (preserveInitialOnEmpty) {
        const keys = parseKeys.length > 0 ? parseKeys : Object.keys(effectiveFilters)
        keys.forEach((key) => {
          const current = effectiveFilters[key]
          if ((current === '' || current === null || current === undefined) && initialFilters[key] !== undefined) {
            effectiveFilters[key] = initialFilters[key]
          }
        })
        setFilters(effectiveFilters)
      }

      if (syncToUrl) {
        const nextParams = new URLSearchParams(searchParamsKey)
        const keys = parseKeys.length > 0 ? parseKeys : Object.keys(effectiveFilters)

        keys.forEach((key) => {
          let serialized = stringifyValue(key, effectiveFilters[key])
          if (!serialized && preserveInitialOnEmpty) {
            serialized = stringifyValue(key, initialFilters[key])
          }
          if (!serialized) nextParams.delete(key)
          else nextParams.set(key, serialized)
        })

        const search = nextParams.toString()
        if (urlMode === 'path' && basePath) {
          const nextUrl = search ? `${basePath}/${encodeURIComponent(search)}` : basePath
          navigate(nextUrl)
        } else {
          navigate({ search: search ? `?${search}` : '' }, { replace: true })
        }
      }

      onFiltersChange?.(effectiveFilters)
    },
    [filters, initialFilters, onFiltersChange, parseKeys, preserveInitialOnEmpty, searchParamsKey, basePath, navigate, stringifyValue, urlMode, syncToUrl]
  )

  const setFilter = React.useCallback(
    (key, value) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value }
        if (autoApply) applyFilters(next)
        return next
      })
    },
    [applyFilters, autoApply]
  )

  const setAllFilters = React.useCallback(
    (next) => {
      setFilters((prev) => {
        const merged = typeof next === 'function' ? next(prev) : next
        if (autoApply) applyFilters(merged)
        return merged
      })
    },
    [applyFilters, autoApply]
  )

  const clearFilters = React.useCallback(() => {
    const next = {}
    const keys = parseKeys.length > 0 ? parseKeys : Object.keys(filters)
    keys.forEach((key) => {
      next[key] = initialFilters[key] ?? ''
    })
    setFilters(next)
    applyFilters(next)
  }, [applyFilters, filters, initialFilters, parseKeys])

  const api = React.useMemo(
    () => ({
      filters,
      setFilter,
      setFilters: setAllFilters,
      applyFilters,
      clearFilters,
    }),
    [applyFilters, clearFilters, filters, setAllFilters, setFilter]
  )

  if (typeof children === 'function') return children(api)
  return children || null
}
