import { Building2, Users, MapPin } from 'lucide-react'
import { Card } from './ui/card'

export function KpiBar({ filtered }) {
  const privateCount = filtered.filter(item => item.tipo?.toLowerCase().includes('privad')).length
  const stateCount = filtered.filter(item => item.tipo?.toLowerCase().includes('estatal')).length
  const activeMunicipalities = new Set(filtered.map(item => item.municipio)).size

  const kpis = [
    {
      label: 'Total mipymes',
      value: filtered.length.toLocaleString('es-CU'),
      icon: Building2,
      iconClass: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Privadas / Estatales',
      value: `${privateCount.toLocaleString('es-CU')} / ${stateCount.toLocaleString('es-CU')}`,
      icon: Users,
      iconClass: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    },
    {
      label: 'Municipios con registros',
      value: activeMunicipalities,
      icon: MapPin,
      iconClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2.5 min-w-0">
      {kpis.map(kpi => (
        <Card key={kpi.label} className="flex items-center gap-3.5 px-4 py-3.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${kpi.iconClass}`}>
            <kpi.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">{kpi.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
