import { useEffect, useRef, useState } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { provinces } from '../data/provinces'
import { municipalityCatalog, activitiesCatalog, typesCatalog } from '../data/mipymes'

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

export function FiltersPanel({ filters, onFiltersChange }) {
  const { searchName, filterProvince, filterMunicipality, filterType, filterActivity } = filters
  const [activitySearch, setActivitySearch] = useState('')
  const [activityOpen, setActivityOpen] = useState(false)
  const activityDropdownRef = useRef(null)
  const activitySearchRef = useRef(null)

  function update(key, value) {
    const next = { ...filters, [key]: value }
    if (key === 'filterProvince') next.filterMunicipality = ''
    onFiltersChange(next)
  }

  const scopedMunicipalities = filterProvince
    ? municipalityCatalog.filter(m => m.province === filterProvince).map(m => m.municipality)
    : municipalityCatalog.map(m => m.municipality)

  const uniqueMunicipalities = [...new Set(scopedMunicipalities)].sort((a, b) => a.localeCompare(b))

  const searchedActivities = activitiesCatalog.filter(activity => {
    if (!activitySearch) return true
    return normalizeText(activity).includes(normalizeText(activitySearch))
  })

  const selectActivities = filterActivity && !searchedActivities.includes(filterActivity)
    ? [filterActivity, ...searchedActivities]
    : searchedActivities

  // Auto-focus the search input whenever the dropdown opens.
  // The short delay ensures the input is visible in the DOM before focus().
  useEffect(() => {
    if (activityOpen) {
      const id = setTimeout(() => activitySearchRef.current?.focus(), 30)
      return () => clearTimeout(id)
    } else {
      setActivitySearch('')
    }
  }, [activityOpen])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!activityDropdownRef.current?.contains(event.target)) {
        setActivityOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setActivityOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function clearActivity(e) {
    e.stopPropagation()
    update('filterActivity', '')
  }

  return (
    <Card className="relative z-10">
      <CardContent className="pt-4 animate-rise-in [animation-delay:120ms]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Denominación</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre..."
                value={searchName}
                className="pl-8"
                onChange={e => update('searchName', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Provincia</label>
            <Select value={filterProvince} onChange={e => update('filterProvince', e.target.value)}>
              <option value="">Todas</option>
              {provinces.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Municipio</label>
            <Select value={filterMunicipality} onChange={e => update('filterMunicipality', e.target.value)}>
              <option value="">Todos</option>
              {uniqueMunicipalities.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Tipo de sujeto</label>
            <Select value={filterType} onChange={e => update('filterType', e.target.value)}>
              <option value="">Todos</option>
              {typesCatalog.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Actividad principal</label>
            <div className="relative" ref={activityDropdownRef}>
              {/* Trigger button */}
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={activityOpen}
                className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => setActivityOpen(open => !open)}
              >
                <span className="truncate">{filterActivity || 'Todas'}</span>
                <span className="ml-2 flex shrink-0 items-center gap-1">
                  {filterActivity && (
                    <span
                      role="button"
                      aria-label="Limpiar actividad"
                      tabIndex={0}
                      className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                      onClick={clearActivity}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && clearActivity(e)}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${activityOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Dropdown panel */}
              {activityOpen && (
                <div
                  className="absolute z-40 mt-1 right-0 min-w-full rounded-lg border border-border bg-card p-2 shadow-xl"
                  style={{ width: 'min(500px, calc(100vw - 2rem))' }}
                >
                  {/* Search box */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={activitySearchRef}
                      type="search"
                      placeholder="Buscar actividad..."
                      value={activitySearch}
                      className="pl-8"
                      onChange={e => setActivitySearch(e.target.value)}
                    />
                  </div>

                  {/* Result count */}
                  <p className="mt-1.5 px-1 text-xs text-muted-foreground">
                    {activitySearch
                      ? `${searchedActivities.length} coincidencia${searchedActivities.length !== 1 ? 's' : ''}`
                      : `${activitiesCatalog.length} actividades`}
                  </p>

                  {/* Options list */}
                  <div className="mt-1 max-h-60 overflow-auto rounded-md border border-border/60" role="listbox">
                    <button
                      type="button"
                      role="option"
                      aria-selected={!filterActivity}
                      className={`w-full border-b border-border/60 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/40 ${!filterActivity ? 'bg-primary/10 font-medium text-primary' : ''}`}
                      onClick={() => {
                        update('filterActivity', '')
                        setActivityOpen(false)
                      }}
                    >
                      Todas
                    </button>

                    {selectActivities.length > 0 ? (
                      selectActivities.map(a => (
                        <button
                          key={a}
                          type="button"
                          role="option"
                          aria-selected={a === filterActivity}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/40 ${a === filterActivity ? 'bg-primary/10 font-medium text-primary' : ''}`}
                          onClick={() => {
                            update('filterActivity', a)
                            setActivityOpen(false)
                          }}
                        >
                          {a}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">Sin coincidencias</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
