/**
 * Las 50 provincias de España para las landing pages por gremio + provincia
 * (/para/{gremio}/{provincia}). `slug` sin acentos ni ñ; `nombre` para mostrar.
 * `capital` y `municipios` (principales, factuales) dan a cada página contenido
 * LOCAL ÚNICO — clave para no ser "thin content" duplicado ante Google.
 */

export interface Provincia {
  slug: string;
  nombre: string;
  capital: string;
  /** Municipios grandes/conocidos de la provincia (sin repetir la capital). */
  municipios: string[];
}

export const PROVINCIAS: Provincia[] = [
  { slug: "alava", nombre: "Álava", capital: "Vitoria-Gasteiz", municipios: ["Llodio", "Amurrio", "Salvatierra"] },
  { slug: "albacete", nombre: "Albacete", capital: "Albacete", municipios: ["Hellín", "Villarrobledo", "Almansa", "La Roda"] },
  { slug: "alicante", nombre: "Alicante", capital: "Alicante", municipios: ["Elche", "Torrevieja", "Orihuela", "Benidorm", "Alcoy"] },
  { slug: "almeria", nombre: "Almería", capital: "Almería", municipios: ["Roquetas de Mar", "El Ejido", "Níjar", "Adra"] },
  { slug: "asturias", nombre: "Asturias", capital: "Oviedo", municipios: ["Gijón", "Avilés", "Langreo", "Mieres"] },
  { slug: "avila", nombre: "Ávila", capital: "Ávila", municipios: ["Arévalo", "Arenas de San Pedro", "Las Navas del Marqués"] },
  { slug: "badajoz", nombre: "Badajoz", capital: "Badajoz", municipios: ["Mérida", "Don Benito", "Almendralejo", "Villanueva de la Serena"] },
  { slug: "baleares", nombre: "Baleares", capital: "Palma", municipios: ["Calvià", "Manacor", "Ibiza", "Mahón"] },
  { slug: "barcelona", nombre: "Barcelona", capital: "Barcelona", municipios: ["L'Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Mataró"] },
  { slug: "vizcaya", nombre: "Vizcaya", capital: "Bilbao", municipios: ["Barakaldo", "Getxo", "Portugalete", "Santurtzi"] },
  { slug: "burgos", nombre: "Burgos", capital: "Burgos", municipios: ["Miranda de Ebro", "Aranda de Duero", "Briviesca"] },
  { slug: "caceres", nombre: "Cáceres", capital: "Cáceres", municipios: ["Plasencia", "Navalmoral de la Mata", "Trujillo"] },
  { slug: "cadiz", nombre: "Cádiz", capital: "Cádiz", municipios: ["Jerez de la Frontera", "Algeciras", "San Fernando", "El Puerto de Santa María"] },
  { slug: "cantabria", nombre: "Cantabria", capital: "Santander", municipios: ["Torrelavega", "Camargo", "Castro-Urdiales"] },
  { slug: "castellon", nombre: "Castellón", capital: "Castellón de la Plana", municipios: ["Vila-real", "Burriana", "Vinaròs"] },
  { slug: "ciudad-real", nombre: "Ciudad Real", capital: "Ciudad Real", municipios: ["Puertollano", "Tomelloso", "Alcázar de San Juan", "Valdepeñas"] },
  { slug: "cordoba", nombre: "Córdoba", capital: "Córdoba", municipios: ["Lucena", "Puente Genil", "Montilla", "Priego de Córdoba"] },
  { slug: "a-coruna", nombre: "A Coruña", capital: "A Coruña", municipios: ["Santiago de Compostela", "Ferrol", "Narón", "Oleiros"] },
  { slug: "cuenca", nombre: "Cuenca", capital: "Cuenca", municipios: ["Tarancón", "Quintanar del Rey", "San Clemente"] },
  { slug: "guipuzcoa", nombre: "Guipúzcoa", capital: "San Sebastián", municipios: ["Irún", "Errenteria", "Eibar", "Zarautz"] },
  { slug: "girona", nombre: "Girona", capital: "Girona", municipios: ["Figueres", "Blanes", "Lloret de Mar", "Olot"] },
  { slug: "granada", nombre: "Granada", capital: "Granada", municipios: ["Motril", "Almuñécar", "Baza", "Loja"] },
  { slug: "guadalajara", nombre: "Guadalajara", capital: "Guadalajara", municipios: ["Azuqueca de Henares", "Alovera", "Cabanillas del Campo"] },
  { slug: "huelva", nombre: "Huelva", capital: "Huelva", municipios: ["Lepe", "Almonte", "Moguer", "Ayamonte"] },
  { slug: "huesca", nombre: "Huesca", capital: "Huesca", municipios: ["Monzón", "Barbastro", "Fraga", "Jaca"] },
  { slug: "jaen", nombre: "Jaén", capital: "Jaén", municipios: ["Linares", "Andújar", "Úbeda", "Martos"] },
  { slug: "leon", nombre: "León", capital: "León", municipios: ["Ponferrada", "San Andrés del Rabanedo", "Astorga"] },
  { slug: "lleida", nombre: "Lleida", capital: "Lleida", municipios: ["Balaguer", "Tàrrega", "Mollerussa"] },
  { slug: "lugo", nombre: "Lugo", capital: "Lugo", municipios: ["Monforte de Lemos", "Viveiro", "Sarria"] },
  { slug: "madrid", nombre: "Madrid", capital: "Madrid", municipios: ["Móstoles", "Alcalá de Henares", "Fuenlabrada", "Leganés", "Getafe"] },
  { slug: "malaga", nombre: "Málaga", capital: "Málaga", municipios: ["Marbella", "Mijas", "Vélez-Málaga", "Fuengirola", "Torremolinos"] },
  { slug: "murcia", nombre: "Murcia", capital: "Murcia", municipios: ["Cartagena", "Lorca", "Molina de Segura", "Alcantarilla"] },
  { slug: "navarra", nombre: "Navarra", capital: "Pamplona", municipios: ["Tudela", "Barañáin", "Estella"] },
  { slug: "ourense", nombre: "Ourense", capital: "Ourense", municipios: ["Verín", "O Barco de Valdeorras", "O Carballiño"] },
  { slug: "palencia", nombre: "Palencia", capital: "Palencia", municipios: ["Aguilar de Campoo", "Guardo", "Venta de Baños"] },
  { slug: "las-palmas", nombre: "Las Palmas", capital: "Las Palmas de Gran Canaria", municipios: ["Telde", "Santa Lucía de Tirajana", "Arrecife", "San Bartolomé de Tirajana"] },
  { slug: "pontevedra", nombre: "Pontevedra", capital: "Pontevedra", municipios: ["Vigo", "Vilagarcía de Arousa", "Redondela", "Marín"] },
  { slug: "la-rioja", nombre: "La Rioja", capital: "Logroño", municipios: ["Calahorra", "Arnedo", "Haro"] },
  { slug: "salamanca", nombre: "Salamanca", capital: "Salamanca", municipios: ["Béjar", "Ciudad Rodrigo", "Santa Marta de Tormes"] },
  { slug: "santa-cruz-de-tenerife", nombre: "Santa Cruz de Tenerife", capital: "Santa Cruz de Tenerife", municipios: ["San Cristóbal de La Laguna", "Arona", "Adeje", "La Orotava"] },
  { slug: "segovia", nombre: "Segovia", capital: "Segovia", municipios: ["Cuéllar", "El Espinar", "Cantalejo"] },
  { slug: "sevilla", nombre: "Sevilla", capital: "Sevilla", municipios: ["Dos Hermanas", "Alcalá de Guadaíra", "Utrera", "Mairena del Aljarafe"] },
  { slug: "soria", nombre: "Soria", capital: "Soria", municipios: ["Almazán", "Ólvega", "San Leonardo de Yagüe"] },
  { slug: "tarragona", nombre: "Tarragona", capital: "Tarragona", municipios: ["Reus", "Tortosa", "El Vendrell", "Cambrils"] },
  { slug: "teruel", nombre: "Teruel", capital: "Teruel", municipios: ["Alcañiz", "Andorra", "Calamocha"] },
  { slug: "toledo", nombre: "Toledo", capital: "Toledo", municipios: ["Talavera de la Reina", "Illescas", "Seseña", "Torrijos"] },
  { slug: "valencia", nombre: "Valencia", capital: "Valencia", municipios: ["Torrent", "Gandia", "Paterna", "Sagunto", "Alzira"] },
  { slug: "valladolid", nombre: "Valladolid", capital: "Valladolid", municipios: ["Medina del Campo", "Laguna de Duero", "Arroyo de la Encomienda"] },
  { slug: "zamora", nombre: "Zamora", capital: "Zamora", municipios: ["Benavente", "Toro", "Morales del Vino"] },
  { slug: "zaragoza", nombre: "Zaragoza", capital: "Zaragoza", municipios: ["Calatayud", "Utebo", "Ejea de los Caballeros", "Tarazona"] },
];

export const PROVINCIA_SLUGS = PROVINCIAS.map((p) => p.slug);

export function getProvincia(slug: string): Provincia | undefined {
  return PROVINCIAS.find((p) => p.slug === slug);
}

/** Índice deterministico y estable a partir del slug (para variar la redacción). */
export function indiceEstable(slug: string): number {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n + slug.charCodeAt(i)) % 997;
  return n;
}
