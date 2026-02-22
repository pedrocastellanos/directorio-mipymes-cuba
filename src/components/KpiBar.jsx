import { Card } from './ui/card'

export function KpiBar({ filtered }) {
  const privateCount = filtered.filter(item => item.tipo?.toLowerCase().includes('privad')).length
  const stateCount = filtered.filter(item => item.tipo?.toLowerCase().includes('estatal')).length
  const activeMunicipalities = new Set(filtered.map(item => item.municipio)).size

  const kpis = [
    { label: 'Total mipymes', value: filtered.length },
    { label: 'Privadas / Estatales', value: `${privateCount} / ${stateCount}` },
    { label: 'Municipios con registros', value: activeMunicipalities },
  ]

  return (
    <div className="grid grid-cols-3 gap-2.5 min-w-0">
      {kpis.map(kpi => (
        <Card key={kpi.label} className="px-3.5 py-3">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="mt-0.5 text-lg font-semibold text-foreground">{kpi.value}</p>
        </Card>
      ))}
    </div>
  )
}
