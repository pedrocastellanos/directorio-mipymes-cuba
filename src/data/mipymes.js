import actoresData from './actores.json'
import municipalitiesGeoJsonRaw from '../maps/cuba-municipalities.geojson?raw'

const municipalitiesGeoJson = JSON.parse(municipalitiesGeoJsonRaw)

function cleanString(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function buildMunicipalityCatalog() {
    const catalog = new Map()
    const features = municipalitiesGeoJson?.features || []

    features.forEach((feature) => {
        const province = cleanString(feature?.properties?.province)
        const municipality = cleanString(feature?.properties?.municipality)
        if (!province || !municipality) return
        catalog.set(`${province}::${municipality}`, { province, municipality })
    })

    return [...catalog.values()].sort((a, b) => {
        const provinceCmp = a.province.localeCompare(b.province)
        if (provinceCmp !== 0) return provinceCmp
        return a.municipality.localeCompare(b.municipality)
    })
}

function normalizeActors(records) {
    if (!Array.isArray(records)) return []

    return records
        .map((item) => {
            const id = Number(item?.numero)
            const nombre = cleanString(item?.denominacion)
            const provincia = cleanString(item?.provincia)

            if (!Number.isFinite(id) || !nombre || !provincia) return null

            return {
                id,
                nombre,
                provincia,
                municipio: cleanString(item?.municipio),
                tipo: cleanString(item?.tipo_sujeto) || 'Sin especificar',
                actividad: cleanString(item?.actividad_economica_principal) || 'Sin especificar'
            }
        })
        .filter(Boolean)
}

export const municipalityCatalog = buildMunicipalityCatalog()
export const municipalityPolygons = municipalityCatalog

export const mipymes = normalizeActors(actoresData)

export const typesCatalog = [...new Set(mipymes.map((item) => item.tipo))]
    .sort((a, b) => a.localeCompare(b))

export const activitiesCatalog = [...new Set(mipymes.map((item) => item.actividad))]
    .sort((a, b) => a.localeCompare(b))
