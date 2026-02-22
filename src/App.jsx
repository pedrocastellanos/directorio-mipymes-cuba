import { useEffect, useMemo, useState } from 'react'
import { Building2 } from 'lucide-react'
import { CubaMap } from './components/CubaMap'
import { FiltersPanel } from './components/FiltersPanel'
import { KpiBar } from './components/KpiBar'
import { MipymesTable } from './components/MipymesTable'
import { mipymes as allMipymes } from './data/mipymes'
import { buildSearchFromFilters, normalizeText, readFiltersFromUrl } from './lib/utils'
import { DIRECTORY_LAST_UPDATE } from './config'
import Footer from './components/Footer'

export default function App() {
  const [filters, setFilters] = useState(() => readFiltersFromUrl())

  useEffect(() => {
    function handlePopState() {
      setFilters(readFiltersFromUrl())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const nextSearch = buildSearchFromFilters(filters)
    if (window.location.search === nextSearch) return

    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [filters])

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
        <header className="rounded-xl border border-border bg-card/70 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Directorio de MIPYMES (no oficial)</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">República de Cuba &nbsp;·&nbsp; Última actualización: {DIRECTORY_LAST_UPDATE}</p>
            </div>
          </div>
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
        <Footer />
      </div>
    </div>
  )
}
