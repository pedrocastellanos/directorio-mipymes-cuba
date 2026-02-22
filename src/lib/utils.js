import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FILTER_QUERY_PARAM_MAP } from "../config"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function readFiltersFromUrl() {
  if (typeof window === 'undefined') return DEFAULT_FILTERS

  const params = new URLSearchParams(window.location.search)
  return {
    searchName: params.get(FILTER_QUERY_PARAM_MAP.searchName) || '',
    filterProvince: params.get(FILTER_QUERY_PARAM_MAP.filterProvince) || '',
    filterMunicipality: params.get(FILTER_QUERY_PARAM_MAP.filterMunicipality) || '',
    filterType: params.get(FILTER_QUERY_PARAM_MAP.filterType) || '',
    filterActivity: params.get(FILTER_QUERY_PARAM_MAP.filterActivity) || '',
  }
}

export function buildSearchFromFilters(filters) {
  const params = new URLSearchParams()
  if (filters.searchName) params.set(FILTER_QUERY_PARAM_MAP.searchName, filters.searchName)
  if (filters.filterProvince) params.set(FILTER_QUERY_PARAM_MAP.filterProvince, filters.filterProvince)
  if (filters.filterMunicipality) params.set(FILTER_QUERY_PARAM_MAP.filterMunicipality, filters.filterMunicipality)
  if (filters.filterType) params.set(FILTER_QUERY_PARAM_MAP.filterType, filters.filterType)
  if (filters.filterActivity) params.set(FILTER_QUERY_PARAM_MAP.filterActivity, filters.filterActivity)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function normalizeText(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
}