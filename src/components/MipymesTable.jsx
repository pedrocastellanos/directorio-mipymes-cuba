import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'

const PAGE_SIZE = 25

const TYPE_STYLES = {
  'MIPYME Privada': 'bg-sky-500/10 text-sky-400 border-sky-500/25',
  'MIPYME Estatal': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'CNA': 'bg-violet-500/10 text-violet-400 border-violet-500/25',
}

const PAGE_BTN_CLS = "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/60"

function TypeBadge({ type }) {
  const cls = TYPE_STYLES[type] ?? 'bg-secondary/60 text-muted-foreground border-border/60'
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${cls}`}>
      {type}
    </span>
  )
}

export function MipymesTable({ filtered }) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

    useEffect(() => {
        setCurrentPage(1)
    }, [filtered])

    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE
        return filtered.slice(start, start + PAGE_SIZE)
    }, [filtered, currentPage])

    function previousPage() {
        setCurrentPage(page => Math.max(1, page - 1))
    }

    function nextPage() {
        setCurrentPage(page => Math.min(totalPages, page + 1))
    }

    return (
        <Card className="animate-rise-in [animation-delay:180ms]">
            <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Listado de MIPYMES</CardTitle>
                <CardDescription>
                    Mostrando {filtered.length.toLocaleString('es-CU')} resultados filtrados.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="overflow-auto rounded-lg border border-border/70">
                    <table className="w-full min-w-[980px] text-sm">
                        <thead>
                            <tr className="border-b border-border/70 bg-secondary/40">
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">No.</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Denominación</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provincia</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Municipio</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de sujeto</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actividad principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.length > 0 ? (
                                paginatedRows.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className={`border-t border-border/40 transition-colors hover:bg-secondary/30 ${idx % 2 === 0 ? '' : 'bg-secondary/10'}`}
                                    >
                                        <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">{item.id}</td>
                                        <td className="px-3 py-2.5 font-medium">{item.nombre}</td>
                                        <td className="px-3 py-2.5 text-muted-foreground">{item.provincia}</td>
                                        <td className="px-3 py-2.5 text-muted-foreground">{item.municipio || 'Sin especificar'}</td>
                                        <td className="px-3 py-2.5"><TypeBadge type={item.tipo} /></td>
                                        <td className="px-3 py-2.5 text-muted-foreground">{item.actividad}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                        No hay resultados para los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                    <p className="text-xs text-muted-foreground">
                        Página <span className="font-medium text-foreground">{currentPage}</span> de <span className="font-medium text-foreground">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={previousPage}
                            disabled={currentPage === 1}
                            aria-label="Página anterior"
                            className={PAGE_BTN_CLS}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Anterior
                        </button>
                        <button
                            type="button"
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            aria-label="Página siguiente"
                            className={PAGE_BTN_CLS}
                        >
                            Siguiente
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
