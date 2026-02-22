import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { provinces } from '../data/provinces'

export function ProvinceStats({ filtered }) {
  const provinceCount = new Map()
  filtered.forEach(item => {
    provinceCount.set(item.provincia, (provinceCount.get(item.provincia) || 0) + 1)
  })

  const rows = provinces
    .map(p => ({
      name: p.name,
      total: provinceCount.get(p.name) || 0,
      municipalities: p.municipalities.length
    }))
    .sort((a, b) => b.total - a.total)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Resumen territorial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-h-[560px] overflow-auto pr-1">
          {rows.map(item => (
            <div
              key={item.name}
              className="rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5"
            >
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.total} mipymes filtradas · {item.municipalities} municipios
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
