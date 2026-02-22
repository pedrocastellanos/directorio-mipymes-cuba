# Directorio de MIPYMES de Cuba (no oficial)

Este proyecto es una aplicación web para explorar un directorio de MIPYMES en Cuba con:

- mapa interactivo por municipios y provincias,
- filtros por denominación, provincia, municipio, tipo y actividad,
- tabla paginada de resultados,
- KPIs de resumen,
- sincronización de filtros con la URL.

## Aviso importante

Este directorio es **no oficial**.

La información utilizada en este proyecto fue tomada de la página oficial del Ministerio de Economía y Planificación de Cuba, en el documento:

- https://www.mep.gob.cu/sites/default/files/Documentos/Archivos/Listado%20de%20Nuevos%20Actores%20Econ%C3%B3micos%20aprobados%20hasta%2009.05.24%20.pdf

## Fuente de datos en el proyecto

Los datos se encuentran en:

- `src/data/actores.json`
- `src/data/mipymes.js`

## Ejecución local

```bash
pnpm install
pnpm dev
```

## Stack

- React
- Vite
- Tailwind CSS
