/**
 * Las 50 provincias de España para las landing pages por gremio + provincia
 * (/para/{gremio}/{provincia}). `slug` sin acentos ni ñ; `nombre` para mostrar.
 */

export interface Provincia {
  slug: string;
  nombre: string;
}

export const PROVINCIAS: Provincia[] = [
  { slug: "alava", nombre: "Álava" },
  { slug: "albacete", nombre: "Albacete" },
  { slug: "alicante", nombre: "Alicante" },
  { slug: "almeria", nombre: "Almería" },
  { slug: "asturias", nombre: "Asturias" },
  { slug: "avila", nombre: "Ávila" },
  { slug: "badajoz", nombre: "Badajoz" },
  { slug: "baleares", nombre: "Baleares" },
  { slug: "barcelona", nombre: "Barcelona" },
  { slug: "vizcaya", nombre: "Vizcaya" },
  { slug: "burgos", nombre: "Burgos" },
  { slug: "caceres", nombre: "Cáceres" },
  { slug: "cadiz", nombre: "Cádiz" },
  { slug: "cantabria", nombre: "Cantabria" },
  { slug: "castellon", nombre: "Castellón" },
  { slug: "ciudad-real", nombre: "Ciudad Real" },
  { slug: "cordoba", nombre: "Córdoba" },
  { slug: "a-coruna", nombre: "A Coruña" },
  { slug: "cuenca", nombre: "Cuenca" },
  { slug: "guipuzcoa", nombre: "Guipúzcoa" },
  { slug: "girona", nombre: "Girona" },
  { slug: "granada", nombre: "Granada" },
  { slug: "guadalajara", nombre: "Guadalajara" },
  { slug: "huelva", nombre: "Huelva" },
  { slug: "huesca", nombre: "Huesca" },
  { slug: "jaen", nombre: "Jaén" },
  { slug: "leon", nombre: "León" },
  { slug: "lleida", nombre: "Lleida" },
  { slug: "lugo", nombre: "Lugo" },
  { slug: "madrid", nombre: "Madrid" },
  { slug: "malaga", nombre: "Málaga" },
  { slug: "murcia", nombre: "Murcia" },
  { slug: "navarra", nombre: "Navarra" },
  { slug: "ourense", nombre: "Ourense" },
  { slug: "palencia", nombre: "Palencia" },
  { slug: "las-palmas", nombre: "Las Palmas" },
  { slug: "pontevedra", nombre: "Pontevedra" },
  { slug: "la-rioja", nombre: "La Rioja" },
  { slug: "salamanca", nombre: "Salamanca" },
  { slug: "santa-cruz-de-tenerife", nombre: "Santa Cruz de Tenerife" },
  { slug: "segovia", nombre: "Segovia" },
  { slug: "sevilla", nombre: "Sevilla" },
  { slug: "soria", nombre: "Soria" },
  { slug: "tarragona", nombre: "Tarragona" },
  { slug: "teruel", nombre: "Teruel" },
  { slug: "toledo", nombre: "Toledo" },
  { slug: "valencia", nombre: "Valencia" },
  { slug: "valladolid", nombre: "Valladolid" },
  { slug: "zamora", nombre: "Zamora" },
  { slug: "zaragoza", nombre: "Zaragoza" },
];

export const PROVINCIA_SLUGS = PROVINCIAS.map((p) => p.slug);

export function getProvincia(slug: string): Provincia | undefined {
  return PROVINCIAS.find((p) => p.slug === slug);
}
