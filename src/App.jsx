import React, { useState, useMemo } from 'react'
import { CubaMap } from './components/CubaMap'
import { FiltersPanel } from './components/FiltersPanel'
import { KpiBar } from './components/KpiBar'
import { MipymesTable } from './components/MipymesTable'
import { mipymes as allMipymes } from './data/mipymes'

const DIRECTORY_LAST_UPDATE = '09/05/2024'

function normalizeText(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
}

export default function App() {
  const [filters, setFilters] = useState({
    searchName: '',
    filterProvince: '',
    filterMunicipality: '',
    filterType: '',
    filterActivity: '',
  })

  const filtered = useMemo(() => {
    const { searchName, filterProvince, filterMunicipality, filterType, filterActivity } = filters
    const name = normalizeText(searchName)
    return allMipymes.filter(item => {
      if (name && !normalizeText(item.nombre).includes(name)) return false
      if (filterProvince && item.provincia !== filterProvince) return false
      if (filterMunicipality && item.municipio !== filterMunicipality) return false
      if (filterType && item.tipo !== filterType) return false
      if (filterActivity && item.actividad !== filterActivity) return false
      return true
    })
  }, [filters])

  function handleMunicipalityClick({ province, municipality }) {
    setFilters(prev => ({
      ...prev,
      filterProvince: province,
      filterMunicipality: municipality,
    }))
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 space-y-4 md:space-y-5">
        <header className="rounded-xl border border-border bg-card/70 px-4 py-3 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">Directorio Nacional de MIPYMES</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Última actualización del directorio: {DIRECTORY_LAST_UPDATE}</p>
        </header>

        <KpiBar filtered={filtered} />

        <CubaMap
          filtered={filtered}
          selectedMunicipality={filters.filterMunicipality}
          selectedProvince={filters.filterProvince}
          onMunicipalitySelect={handleMunicipalityClick}
        />
        <FiltersPanel filters={filters} onFiltersChange={setFilters} />
        <MipymesTable filtered={filtered} />
      </div>
    </div>
  )
}
