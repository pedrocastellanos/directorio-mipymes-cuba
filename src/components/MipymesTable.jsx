import { useMemo, useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'

const PAGE_SIZE = 25

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
                        <thead className="bg-secondary/50 text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">No.</th>
                                <th className="px-3 py-2 text-left font-medium">Denominación</th>
                                <th className="px-3 py-2 text-left font-medium">Provincia</th>
                                <th className="px-3 py-2 text-left font-medium">Municipio</th>
                                <th className="px-3 py-2 text-left font-medium">Tipo de sujeto</th>
                                <th className="px-3 py-2 text-left font-medium">Actividad principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.length > 0 ? (
                                paginatedRows.map(item => (
                                    <tr key={item.id} className="border-t border-border/60 hover:bg-secondary/25">
                                        <td className="px-3 py-2 text-muted-foreground">{item.id}</td>
                                        <td className="px-3 py-2 font-medium">{item.nombre}</td>
                                        <td className="px-3 py-2">{item.provincia}</td>
                                        <td className="px-3 py-2">{item.municipio || 'Sin especificar'}</td>
                                        <td className="px-3 py-2">{item.tipo}</td>
                                        <td className="px-3 py-2">{item.actividad}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                                        No hay resultados para los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={previousPage}
                            disabled={currentPage === 1}
                            className="rounded-md border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="rounded-md border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
