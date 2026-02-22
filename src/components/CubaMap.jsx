import { useRef, useState } from 'react'
import municipalitiesGeoJsonRaw from '../maps/cuba-municipalities.geojson?raw'
import provincesGeoJsonRaw from '../maps/cuba-provinces.geojson?raw'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const municipalitiesGeoJson = JSON.parse(municipalitiesGeoJsonRaw)
const provincesGeoJson = JSON.parse(provincesGeoJsonRaw)

const MAP_WIDTH = 1800
const MAP_HEIGHT = 520
const PADDING = 20
const MIN_ZOOM = 1
const MAX_ZOOM = 6
const ZOOM_STEP = 0.25

function getGeometryRings(geometry) {
  if (!geometry?.type || !geometry?.coordinates) return []
  if (geometry.type === 'Polygon') return geometry.coordinates
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat()
  return []
}

function getBounds(features) {
  let minLon = Infinity
  let maxLon = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  features.forEach(feature => {
    getGeometryRings(feature.geometry).forEach(ring => {
      ring.forEach(([lon, lat]) => {
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      })
    })
  })

  return { minLon, maxLon, minLat, maxLat }
}

function createProjector(bounds) {
  const drawableWidth = MAP_WIDTH - PADDING * 2
  const drawableHeight = MAP_HEIGHT - PADDING * 2
  const lonSpan = bounds.maxLon - bounds.minLon || 1
  const latSpan = bounds.maxLat - bounds.minLat || 1

  return ([lon, lat]) => {
    const x = PADDING + ((lon - bounds.minLon) / lonSpan) * drawableWidth
    const y = PADDING + ((bounds.maxLat - lat) / latSpan) * drawableHeight
    return [x, y]
  }
}

function toSvgPath(rings, project) {
  return rings
    .map(ring => {
      if (!ring.length) return ''
      const [firstX, firstY] = project(ring[0])
      const commands = [`M ${firstX.toFixed(2)} ${firstY.toFixed(2)}`]
      for (let i = 1; i < ring.length; i += 1) {
        const [x, y] = project(ring[i])
        commands.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
      }
      commands.push('Z')
      return commands.join(' ')
    })
    .join(' ')
}

function computeProvinceCenters(features, project) {
  const provinceBounds = new Map()

  features.forEach(feature => {
    const province = feature.properties?.province
    if (!province) return
    const entry = provinceBounds.get(province) || { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }

    getGeometryRings(feature.geometry).forEach(ring => {
      ring.forEach(point => {
        const [x, y] = project(point)
        if (x < entry.minX) entry.minX = x
        if (x > entry.maxX) entry.maxX = x
        if (y < entry.minY) entry.minY = y
        if (y > entry.maxY) entry.maxY = y
      })
    })

    provinceBounds.set(province, entry)
  })

  return [...provinceBounds.entries()].map(([province, bounds]) => ({
    province,
    x: (bounds.minX + bounds.maxX) / 2,
    y: bounds.minY - 8,
  }))
}

const municipalityFeatures = municipalitiesGeoJson.features || []
const provinceFeatures = provincesGeoJson.features || []
const mapBounds = getBounds(municipalityFeatures)
const project = createProjector(mapBounds)

const municipalityShapes = municipalityFeatures
  .map((feature, index) => {
    const municipality = feature.properties?.municipality
    const province = feature.properties?.province
    const path = toSvgPath(getGeometryRings(feature.geometry), project)
    if (!municipality || !province || !path) return null

    return {
      key: `${province}-${municipality}-${index}`,
      municipality,
      province,
      path,
    }
  })
  .filter(Boolean)

const provinceShapes = provinceFeatures
  .map((feature, index) => {
    const province = feature.properties?.province
    const path = toSvgPath(getGeometryRings(feature.geometry), project)
    if (!province || !path) return null

    return {
      key: `${province}-${index}`,
      province,
      path,
    }
  })
  .filter(Boolean)

const provinceLabels = computeProvinceCenters(municipalityFeatures, project)

function colorForCount(value, max) {
  if (!max || value === 0) return 'hsl(220 35% 20%)'
  const ratio = Math.max(0, Math.min(1, value / max))
  const lightness = 22 + ratio * 33
  return `hsl(199 95% ${lightness}%)`
}

export function CubaMap({ filtered, onMunicipalitySelect, selectedMunicipality, selectedProvince }) {
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOrigin, setDragOrigin] = useState(null)
  const hasDraggedRef = useRef(false)

  function clampPan(nextX, nextY, zoomValue = zoom) {
    const maxX = ((zoomValue - 1) * MAP_WIDTH) / 2
    const maxY = ((zoomValue - 1) * MAP_HEIGHT) / 2
    return {
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    }
  }

  function applyZoom(nextZoom) {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom))
    setZoom(clamped)
    setPan(prev => clampPan(prev.x, prev.y, clamped))
  }

  function zoomIn() {
    applyZoom(zoom + ZOOM_STEP)
  }

  function zoomOut() {
    applyZoom(zoom - ZOOM_STEP)
  }

  function resetZoom() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function handleWheel(event) {
    event.preventDefault()
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
    applyZoom(zoom + delta)
  }

  function handleMouseDown(event) {
    if (zoom <= 1) return
    setIsDragging(true)
    setTooltip(null)
    hasDraggedRef.current = false
    setDragOrigin({
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    })
  }

  function handleMouseMove(event) {
    if (!isDragging || !dragOrigin) return
    const nextX = event.clientX - dragOrigin.x
    const nextY = event.clientY - dragOrigin.y
    if (Math.abs(nextX - pan.x) > 2 || Math.abs(nextY - pan.y) > 2) {
      hasDraggedRef.current = true
    }
    const next = clampPan(nextX, nextY)
    setPan(next)
  }

  function stopDragging() {
    setIsDragging(false)
    setDragOrigin(null)
  }

  const municipalityCount = new Map()
  const provinceCount = new Map()
  filtered.forEach(item => {
    municipalityCount.set(item.municipio, (municipalityCount.get(item.municipio) || 0) + 1)
    provinceCount.set(item.provincia, (provinceCount.get(item.provincia) || 0) + 1)
  })

  const maxMunicipality = Math.max(...municipalityShapes.map(m => municipalityCount.get(m.municipality) || 0), 1)

  return (
    <Card className="w-full animate-rise-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Mapa de Cuba por provincias y municipios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-md border border-border bg-card/90 p-1 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Alejar"
              className="h-7 w-7 rounded border border-border text-sm text-foreground hover:bg-accent"
              onClick={zoomOut}
            >
              −
            </button>
            <button
              type="button"
              aria-label="Acercar"
              className="h-7 w-7 rounded border border-border text-sm text-foreground hover:bg-accent"
              onClick={zoomIn}
            >
              +
            </button>
            <button
              type="button"
              className="h-7 rounded border border-border px-2 text-[11px] text-foreground hover:bg-accent"
              onClick={resetZoom}
            >
              100%
            </button>
          </div>

          <div
            className="overflow-hidden rounded-xl border border-border/70 map-surface"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="w-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '50% 50%',
                transition: isDragging ? 'none' : 'transform 120ms ease-out',
                userSelect: 'none'
              }}
              aria-label="Mapa de Cuba dividido por municipios"
            >
              {municipalityShapes.map((item, i) => {
                const count = municipalityCount.get(item.municipality) || 0
                const provinceTotal = provinceCount.get(item.province) || 0
                const fill = colorForCount(count, maxMunicipality)
                const isSelected = item.municipality === selectedMunicipality && item.province === selectedProvince

                return (
                  <path
                    key={item.key}
                    d={item.path}
                    fill={fill}
                    stroke={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--border))'}
                    strokeWidth={isSelected ? '1.8' : '0.85'}
                    style={{ animationDelay: `${Math.min(i * 2, 360)}ms` }}
                    className="map-municipality map-entry"
                    onMouseMove={e => !isDragging && setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      municipality: item.municipality,
                      province: item.province,
                      count,
                      provinceTotal
                    })}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (hasDraggedRef.current) return
                      onMunicipalitySelect?.({
                        province: item.province,
                        municipality: item.municipality,
                      })
                    }}
                  />
                )
              })}

              {provinceShapes.map(shape => (
                <path
                  key={shape.key}
                  d={shape.path}
                  fill="none"
                  stroke="hsl(var(--foreground) / 0.85)"
                  strokeWidth="1.75"
                  className="map-province-border"
                />
              ))}

              {provinceLabels.map(label => (
                <text
                  key={label.province}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  fill="hsl(var(--foreground) / 0.92)"
                  fontSize="13"
                  fontWeight="700"
                  stroke="hsl(var(--background) / 0.95)"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {label.province}: {provinceCount.get(label.province) || 0}
                </text>
              ))}
            </svg>
          </div>

          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none rounded-lg border border-border bg-card/95 px-3 py-2 text-xs text-foreground shadow-lg whitespace-nowrap animate-tooltip-in"
              style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, calc(-100% - 12px))' }}
            >
              <strong>{tooltip.municipality}</strong>
              <br />{tooltip.province}
              <br />Municipio: {tooltip.count} | Provincia: {tooltip.provinceTotal}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Menor densidad</span>
          <div className="h-2.5 flex-1 rounded-full map-legend" />
          <span>Mayor densidad</span>
        </div>
      </CardContent>
    </Card>
  )
}
