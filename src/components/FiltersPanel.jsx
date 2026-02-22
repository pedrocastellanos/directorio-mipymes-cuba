import { useEffect, useRef, useState } from 'react'
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

  function update(key, value) {
    const next = { ...filters, [key]: value }
    if (key === 'filterProvince') next.filterMunicipality = ''
    onFiltersChange(next)
  }

  const scopedMunicipalities = filterProvince
    ? municipalityCatalog.filter(m => m.province === filterProvince).map(m => m.municipality)
    : municipalityCatalog.map(m => m.municipality)

  const uniqueMunicipalities = [...new Set(scopedMunicipalities)].sort((a, b) => a.localeCompare(b))
  const sortedActivities = activitiesCatalog
  const searchedActivities = sortedActivities.filter(activity => {
    if (!activitySearch) return true
    return normalizeText(activity).includes(normalizeText(activitySearch))
  })

  const selectActivities = filterActivity && !searchedActivities.includes(filterActivity)
    ? [filterActivity, ...searchedActivities]
    : searchedActivities

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!activityDropdownRef.current?.contains(event.target)) {
        setActivityOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <Card>
      <CardContent className="pt-4 animate-rise-in [animation-delay:120ms]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Denominación</label>
            <Input
              type="search"
              placeholder="Buscar por nombre..."
              value={searchName}
              onChange={e => update('searchName', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Provincia</label>
            <Select value={filterProvince} onChange={e => update('filterProvince', e.target.value)}>
              <option value="">Todas</option>
              {provinces.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Municipio</label>
            <Select value={filterMunicipality} onChange={e => update('filterMunicipality', e.target.value)}>
              <option value="">Todos</option>
              {uniqueMunicipalities.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Tipo de sujeto</label>
            <Select value={filterType} onChange={e => update('filterType', e.target.value)}>
              <option value="">Todos</option>
              {typesCatalog.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Actividad principal</label>
            <div className="relative" ref={activityDropdownRef}>
              <button
                type="button"
                className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => setActivityOpen(open => !open)}
              >
                <span className="truncate">{filterActivity || 'Todas'}</span>
                <span className="ml-2 text-xs text-muted-foreground">▾</span>
              </button>

              {activityOpen && (
                <div className="absolute z-40 mt-1 w-full rounded-lg border border-border bg-card p-2 shadow-lg">
                  <Input
                    type="search"
                    placeholder="Buscar actividad..."
                    value={activitySearch}
                    onChange={e => setActivitySearch(e.target.value)}
                  />

                  <div className="mt-2 max-h-56 overflow-auto rounded-md border border-border/60">
                    <button
                      type="button"
                      className="w-full border-b border-border/60 px-3 py-2 text-left text-sm hover:bg-secondary/40"
                      onClick={() => {
                        update('filterActivity', '')
                        setActivityOpen(false)
                        setActivitySearch('')
                      }}
                    >
                      Todas
                    </button>

                    {selectActivities.length > 0 ? (
                      selectActivities.map(a => (
                        <button
                          key={a}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/40"
                          onClick={() => {
                            update('filterActivity', a)
                            setActivityOpen(false)
                            setActivitySearch('')
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
