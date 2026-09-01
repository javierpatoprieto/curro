# Explora Siam — Propuesta de rediseño web

**Fecha:** 2026-09-01
**Estado:** propuesta estratégica y de diseño (previa a wireframes y build)
**Cliente:** Explora Siam · explorasiam.com · viajes de autor a Tailandia en grupo reducido
**Alcance:** landing principal (home) con capacidad de crecer a fichas de viaje, stack Astro + CMS ligero editable, captación por WhatsApp.

---

## 0. Punto de partida (lo que hay hoy)

Antes de proponer, lo que se ve al entrar en explorasiam.com el 1 de septiembre de 2026:

| Aspecto | Estado actual |
|---|---|
| Plataforma | WordPress con tema de bloques genérico (paleta azul por defecto `#1f7cec`), Rank Math, plugin de formulario. |
| Home | Un H2 "Descubre Tailandia de una forma diferente", el aviso "Página en construcción. Muchas gracias!", tres fotos verticales de móvil etiquetadas DOI INTHANON / SHUKHOTAI (sic) / BANGKOK y el cierre "Vive Tailandia de una forma diferente". |
| Páginas | Contacto (email, teléfono, formulario), Services (texto de plantilla en inglés sin editar: "Web Design… From $99"), cuatro páginas legales, un post "Hello world!" de 2023. |
| Meta description | "DOI INTHANON" (heredada de la primera imagen). |
| WhatsApp | No existe ningún enlace ni botón. El teléfono aparece solo como texto en Contacto. |
| Prueba social | Ninguna. Ni viajeros, ni reseñas, ni fechas, ni precios, ni quién está detrás. |
| Voz | Primera persona ("Puedes encontrarme en", "Escríbeme"): es un proyecto de autor de una sola persona. Eso es un activo, no una debilidad. |
| Activos gráficos | Logo verde (`logo-green.svg`) y versión blanca. La marca ya "es verde": lo aprovechamos. |
| Instagram | @explora_siam enlazado. |

Conclusión: no hay nada que "rediseñar" en sentido estricto. Hay que **construir la marca digital desde cero** sobre tres cosas que sí existen: un nombre bonito, un color, y una persona que conoce Tailandia y contesta ella misma.

---

## 1. Auditoría estratégica inicial

### 1.1 Qué debe comunicar Explora Siam

Una persona que busca "viaje a Tailandia" hoy encuentra dos mundos: agencias grandes con paquetes de 12 días y precios por persona, o el viaje mochilero por su cuenta. Explora Siam tiene que ocupar el hueco entre ambos: **el viaje que harías con un amigo que vive allí**, organizado con la seriedad de una agencia registrada y la intimidad de un grupo pequeño.

Cinco mensajes que la home tiene que dejar claros en menos de 30 segundos de scroll:

1. **Qué es:** viajes a Tailandia en grupo reducido, con salidas fechadas, diseñados y acompañados por su fundador.
2. **Por qué es distinto:** ritmo lento, lugares que no salen en el paquete estándar (Doi Inthanon, Sukhothai, pueblos del norte, mercados de madrugada), comida de verdad, tiempo libre pensado.
3. **Que es de fiar:** agencia registrada para viajes combinados, seguro, itinerario cerrado, precio claro, fundador con nombre y cara.
4. **Que es cercano:** se habla por WhatsApp con la persona que va a viajar contigo, no con un call center.
5. **Que hay que decidirse:** grupos de 8 a 12 plazas y dos o tres salidas al año. La escasez es real, así que se puede comunicar sin trucos.

### 1.2 Posicionamiento

> **Explora Siam es el viaje de autor a Tailandia para quien quiere ver el país de verdad sin renunciar a que todo esté resuelto.**

- **Categoría:** viajes de autor en grupo reducido (no "agencia de viajes", no "tour operador").
- **Territorio:** Tailandia en profundidad, con foco en el norte y lo rural, en lugar de "Sudeste Asiático" genérico. Especializarse es lo que permite cobrar valor.
- **Enemigo declarado (sin nombrarlo):** el circuito de autobús, el hotel de cadena, la playa de tumbonas, el guía que lee un guion.
- **Competencia real:** Siamtrails/viajeatailandia.com (agencia local grande en español, estética corporativa), Kalemo Tours, y en el plano emocional Desafío Nómada y otras marcas de "viajes de autor" con creadores al frente.

### 1.3 Propuesta de valor (fórmula para copy)

**Para** viajeros de 30 a 55 años que ya han hecho algún viaje largo y quieren Tailandia sin turistadas, **Explora Siam** ofrece **viajes de 12 a 15 días en grupos de máximo 12 personas, diseñados y acompañados por alguien que conoce el país de primera mano**, con **rutas que combinan lo imprescindible con lo que nadie te enseña**, y **una sola persona de contacto por WhatsApp desde la primera duda hasta el vuelo de vuelta**.

Tres pilares que sostienen la propuesta y que la web repite en distintas formas:

| Pilar | Cómo se traduce en la web |
|---|---|
| **Autenticidad** | Fotografía real del fundador y de grupos anteriores, nombres de lugares concretos, nada de bancos de imágenes. |
| **Intimidad** | Cifras de grupo siempre visibles, retrato del fundador, voz en primera persona. |
| **Todo resuelto** | Itinerario día a día, qué incluye, agencia registrada, seguro, precio desde, FAQ honestas. |

### 1.4 Tono de marca

- **Primera persona del singular** en el copy de marca ("Yo llevo X años yendo a Tailandia") y **segunda del singular** con el visitante ("Cuéntame qué viaje tienes en la cabeza"). Nunca "nuestros clientes" ni "ofrecemos".
- **Concreto antes que adjetivo.** "Desayunamos en el mercado de Warorot a las 7" vence a "experiencias inolvidables". Prohibidas: inolvidable, único, mágico, exótico (como adjetivo), auténtico (si se usa más de una vez).
- **Cálido y seguro, no épico.** Desafío Nómada juega la carta de la adrenalina ("Si no te pone los pelos de punta, no es suficiente"). Explora Siam no compite ahí: su registro es el de un anfitrión que sabe, más "te va a encantar este sitio" que "atrévete".
- **Honesto con lo práctico.** Precio, fechas, dificultad física, calor, comida picante. Las FAQ dicen la verdad.
- **Humor ligero puntual**, sobre todo en microcopys de WhatsApp y errores.

### 1.5 Percepción deseada

Que al cerrar la pestaña el visitante piense: *"Este tío sabe de lo que habla, esto es serio y me apetece mucho. Le escribo."*

Tres palabras que deben salir en un test de cinco segundos: **Tailandia · pequeño · de confianza.**

### 1.6 Qué inspira de la referencia (Desafío Nómada) y qué no

Lo que capturamos como principio, no como plantilla:

| Elemento de la referencia | Qué nos llevamos | Qué NO copiamos |
|---|---|---|
| Hero-manifiesto ("No somos una agencia de viajes tradicional") | Abrir con una postura, no con un eslogan de agencia. | La negación literal. Explora Siam abre afirmando qué es. |
| Fundadores con nombre, cara y años de barro | El fundador como garantía. Su retrato y su historia son parte del producto. | El tono "creador de contenido". Aquí es anfitrión. |
| Viaje = Destino · Mes · Grupo reducido | Presentar cada salida con fecha, plazas y grupo como un evento, no como un catálogo. | La ausencia de precio e itinerario. Nosotros los enseñamos: son confianza. |
| "Grupo completado" | Escasez real visible: plazas restantes, salidas cerradas que siguen apareciendo tachadas. | Escasez inventada o cuentas atrás. |
| Sensación editorial y frases largas | Ritmo de lectura pausado, tipografía grande, mucho aire. | El texto sin imágenes. Explora Siam es el país más fotogénico de Asia: la foto manda. |
| Claridad comercial: dos viajes, dos botones | Una sola acción principal por pantalla. | La falta de WhatsApp. En nuestro caso es el canal. |

Lo que la referencia no tiene y nosotros sí necesitamos: galería inmersiva, vídeo, itinerario visible, testimonios con cara, FAQ, y CTA de conversación inmediata.

---

## 2. Concepto creativo

Tres direcciones distintas, las tres compatibles con la paleta verde heredada del logo. Se diferencian en de dónde sale la premiumness: del papel, de la luz o de la mano.

### Dirección A — "Crónica de Siam"

- **Idea rectora:** la web como un reportaje largo de revista de viajes. Un número monográfico sobre Tailandia escrito por alguien que vive allí. Cada sección es un pliego.
- **Personalidad visual:** editorial contemporáneo, calmado, seguro de sí mismo. Mucho papel, tipografía serif grande con carácter, fotos a sangre que interrumpen el texto. Referencias de nivel: *Cereal*, *Monocle Travel Guides*, la web de Black Tomato.
- **Paleta:** Marfil `#F4EFE6` (fondo base), Tinta selva `#10221C` (texto y bloques oscuros), Verde templo `#1F5A46` (marca, heredado del logo), Oro chedi `#C9A24B` (acento escaso: fechas, subrayados, sellos), Laterita `#B8563A` (acento cálido secundario, badges de "últimas plazas").
- **Tipografías:** *Fraunces* (display serif variable, con ejes de "softness" y ópticos: permite titulares con personalidad sin ser un serif de lujo cliché) + *Instrument Sans* (texto y UI) + *JetBrains Mono* o *Geist Mono* en tamaño pequeño para etiquetas técnicas (fechas, km, plazas), que dan aire de cuaderno de expedición.
- **Fotografía y vídeo:** luz natural, mañana y atardecer, personas de espaldas o en acción, mercados, monjes, niebla del norte, muchas verticales. Vídeo corto y lento (8 a 12 segundos, loop), planos fijos con movimiento interno (agua, humo, tela, tráfico) más que cámara en mano.
- **Animación:** reveal por scroll suave (opacidad + 24 px), imágenes que se "descubren" con clip-path, parallax muy sutil solo en el hero y en dos imágenes grandes, texto que no se mueve. Transiciones de página con View Transitions.
- **Sensación final:** "Esto es serio y tiene gusto". Lujo tranquilo. Ganas de leer entero.

### Dirección B — "Hora dorada"

- **Idea rectora:** Tailandia como película. La web es una sala oscura donde la luz entra por las imágenes. Vídeo full-screen, sonido opcional, contraste alto.
- **Personalidad visual:** cinematográfica, inmersiva, nocturna. Fondos oscuros casi negros, tipografía sans condensada enorme, dorados y turquesas que salen de las propias imágenes.
- **Paleta:** Noche `#0B0F0E`, Humo `#1C2321`, Oro `#D8A94A`, Turquesa Andamán `#2C8C85`, Blanco cálido `#F5F0E8`.
- **Tipografías:** *Bricolage Grotesque* o *Archivo* en pesos altos y condensados para display; *Inter* o *Manrope* para texto.
- **Fotografía y vídeo:** vídeo protagonista (drone, cámara lenta, contraluz, faroles, lluvia de monzón, mercados nocturnos). Fotografía con grano fino, sombras profundas, color grading cálido.
- **Animación:** scroll con pinning (secciones que se quedan fijas mientras cambia el contenido), vídeo que se escala al hacer scroll, texto que aparece letra a letra en el hero, cursor personalizado en desktop.
- **Sensación final:** "Quiero estar ahí ya". Deseo puro, impacto en los primeros tres segundos.

### Dirección C — "Cuaderno de ruta"

- **Idea rectora:** la web es el cuaderno del fundador. Mapas dibujados, notas al margen, sellos de aduana, fotos "pegadas" con esquinas, tickets de tren. Lo artesanal como prueba de que alguien ha estado allí de verdad.
- **Personalidad visual:** cálida, táctil, imperfecta a propósito. Texturas de papel, tinta, trazos manuales, rotación leve de elementos.
- **Paleta:** Papel `#EFE7D6`, Tinta `#2B2A26`, Verde `#2E6B4F`, Rojo lacre `#A3352C`, Azul mapa `#3E6E8E`.
- **Tipografías:** *Caveat* o *Nanum Pen* (manuscrita, con cuentagotas), *Libre Caslon* o *Newsreader* (texto tipo libro), *Space Grotesk* para UI.
- **Fotografía y vídeo:** fotos analógicas o con look de carrete, polaroids, vídeo vertical estilo "lo que grabé con el móvil", muy honesto.
- **Animación:** elementos que "caen" sobre la mesa al hacer scroll, sellos que se estampan, trazos que se dibujan (SVG line drawing), mapa con la ruta trazándose.
- **Sensación final:** "Esto lo ha hecho una persona que ama el sitio". Cercanía máxima, artesanía, complicidad.

### Recomendación: Dirección A, "Crónica de Siam", con el hero de la B

Razones, en orden de peso:

1. **Es la que mejor sostiene precio.** Un viaje de autor a Tailandia se vende entre 2.500 y 4.000 € por persona. Lo editorial comunica criterio y calma, y eso justifica valor mejor que la adrenalina (B) o la artesanía (C), que a partir de cierto ticket empieza a parecer "amateur".
2. **Perdona el material real.** Hoy las fotos son de móvil, verticales y de luz natural. El diseño editorial las dignifica (márgenes, pies de foto, tamaño generoso). La dirección B exige vídeo profesional y color grading para no parecer barata; sin ese material, se cae.
3. **Se diferencia de la referencia y de la competencia.** Desafío Nómada juega al desafío y a lo crudo. Siamtrails y compañía juegan al azul corporativo. Nadie en este nicho en español está en el registro "revista de viajes bien hecha".
4. **Envejece bien y escala.** Cuando haya fichas de viaje, blog o guías, un sistema editorial las absorbe sin esfuerzo. Lo cinematográfico se agota en la home; lo manuscrito se vuelve ruido con mucho contenido.
5. **Rinde.** Menos vídeo pesado, menos scripts de scroll, mejor Core Web Vitals, mejor SEO.

Lo que tomamos prestado de B: **el hero con vídeo a pantalla completa y titular grande**, porque la primera pantalla sí tiene que hacer "sentir" antes de "leer". Lo que tomamos de C: **etiquetas en monoespaciada y un único recurso manual** (una firma o un trazo de ruta en el mapa), para que la mano del fundador esté presente sin convertir la web en un scrapbook.

---

## 3. Estructura de la landing page

Principio de orden: **impacto → confianza → producto → cómo se siente → quién está detrás → prueba → objeciones → conversación.** Cada sección tiene una única acción y todas apuntan a WhatsApp, salvo la de salidas, que además permite ver el detalle.

Longitud objetivo en desktop: 11 a 12 pantallas. En mobile, cada sección cabe en un scroll y medio.

### 3.0 Navegación

- **Objetivo:** no estorbar. Mantener el CTA a la vista.
- **Contenido:** logo (versión blanca sobre hero, verde al hacer scroll), tres anclas (Salidas · Cómo viajamos · Preguntas), botón "Hablemos por WhatsApp" (icono + texto en desktop, solo icono en mobile hasta que se despliega la barra inferior).
- **Comportamiento:** transparente sobre el hero, se convierte en barra marfil con blur y borde de 1 px al pasar los primeros 80 px. En mobile, menú a pantalla completa con las tres anclas en tipografía grande y el CTA abajo.

### 3.1 Hero — "La postura"

- **Objetivo:** que en tres segundos se entienda qué es esto y para quién, y que apetezca seguir.
- **Mensaje principal:** viaje de autor a Tailandia, en grupo pequeño, con alguien que la conoce.
- **Copy orientativo:**
  - Kicker (mono, mayúsculas): `VIAJES DE AUTOR · TAILANDIA · GRUPOS DE 8 A 12`
  - H1: **"Tailandia como no te la va a enseñar ninguna agencia."**
    Alternativa más cálida: **"La Tailandia que conoces cuando alguien te la enseña despacio."**
  - Sub: "Salidas en grupo reducido diseñadas y acompañadas por mí, con las rutas que llevo años recorriendo. Tú traes las ganas; del resto me encargo yo."
  - CTA primario: **"Cuéntame tu viaje por WhatsApp"**
  - CTA secundario (fantasma): **"Ver próximas salidas"** (ancla)
  - Pie del hero (fila de datos en mono): `Próxima salida · Norte de Tailandia · 12 nov 2026 · 4 plazas`
- **Contenido visual:** vídeo loop de 10 segundos a pantalla completa (niebla levantándose en Doi Inthanon, o un mercado flotante al amanecer), con fallback a foto. Overlay de degradado vertical tinta al 55 % abajo y 15 % arriba para legibilidad, nunca un velo plano.
- **Desktop:** 100 vh, titular alineado a la izquierda ocupando el 60 % del ancho, CTAs debajo, fila de datos abajo a la izquierda, un indicador de scroll fino abajo a la derecha.
- **Mobile:** 100 svh, vídeo sustituido por foto vertical (ahorra datos y batería), titular a 40 px, CTAs apilados a ancho completo, fila de datos en dos líneas.
- **CTA asociado:** WhatsApp con mensaje predefinido `hero`.

### 3.2 Franja de confianza — "Los hechos"

- **Objetivo:** despejar la primera duda ("¿esto es serio?") sin que parezca un bloque de "por qué elegirnos".
- **Mensaje principal:** números pequeños, reales, verificables.
- **Copy orientativo (cuatro ítems, editables):** `Grupos de máximo 12` · `X viajeros desde 2021` · `Agencia registrada de viajes combinados` · `Yo voy en cada viaje`.
- **Contenido visual:** sin iconos. Cifra en Fraunces a 40 px, etiqueta en mono debajo. Separadores de 1 px. Opcionalmente, una tira de logos de prensa o de la Red de Agencias si existiera; si no, nada.
- **Desktop:** fila de cuatro columnas sobre marfil, justo bajo el hero, altura 160 px.
- **Mobile:** grid 2×2.
- **CTA:** ninguno. Esta sección respira.

### 3.3 Manifiesto — "Esto no es un tour"

- **Objetivo:** posicionar. Decir con qué no se debe confundir y qué se va a encontrar.
- **Mensaje principal:** viajamos despacio, a sitios concretos, con tiempo para perderse.
- **Copy orientativo:**
  - H2 (grande, parte en cursiva de Fraunces): **"No es un circuito. Es *un viaje de verdad* con alguien que sabe dónde parar."**
  - Tres párrafos cortos con título en mono:
    - `01 · SIN AUTOBÚS DE 50` — "Vamos en grupos de 8 a 12 en furgonetas y trenes. Cabemos en una mesa de un restaurante de barrio."
    - `02 · LO QUE NO SALE EN EL PAQUETE` — "Amanecer en Doi Inthanon, las ruinas de Sukhothai sin nadie, un pueblo del norte donde me conocen. Y sí, también Bangkok, pero como se vive, no como se visita."
    - `03 · TIEMPO PARA TI` — "Cada día tiene una parte cerrada y una parte libre. Un viaje no es una lista de tareas."
- **Contenido visual:** una fotografía vertical grande a la derecha (persona en un mercado, de espaldas) con pie de foto en mono: `Mercado de Warorot, Chiang Mai, 6:40 am`.
- **Desktop:** dos columnas 7/5, texto a la izquierda con mucho aire, imagen a la derecha con parallax de 6 %.
- **Mobile:** titular, imagen, tres bloques. La imagen se recorta a 4:5.
- **CTA:** enlace de texto "Así fue el último viaje →" hacia la galería.

### 3.4 Próximas salidas — "El producto"

- **Objetivo:** convertir el deseo en una decisión concreta. Es la sección más importante después del hero.
- **Mensaje principal:** hay fechas, hay plazas, hay precio, y se acaban.
- **Copy orientativo:**
  - Kicker: `PRÓXIMAS SALIDAS 2026–2027`
  - H2: **"Elige cuándo."**
  - Sub: "Dos o tres salidas al año. Cuando un grupo se llena, se llena."
  - Cada tarjeta: nombre del viaje ("Norte profundo: Chiang Mai, Pai y Doi Inthanon"), fechas (`12 – 26 nov 2026`), duración (`15 días`), grupo (`máx. 12 · quedan 4`), precio (`desde 2.890 € · vuelos no incluidos`), tres highlights en una línea, botón "Quiero este viaje" (WhatsApp con el nombre del viaje) y enlace "Ver itinerario día a día".
  - Tarjeta de salida cerrada: se mantiene, con la etiqueta `GRUPO COMPLETO` y un enlace "Avísame de la próxima".
- **Contenido visual:** una foto por viaje en 4:5, tratada con el mismo grading. La foto ocupa el 60 % de la tarjeta; el resto es información en marfil. Badge de plazas en laterita si quedan 3 o menos.
- **Desktop:** tres tarjetas en fila si hay tres; si hay dos, dos grandes; si hay una, layout de "salida destacada" a ancho completo con la foto a la izquierda. El CMS decide por número de salidas activas.
- **Mobile:** carrusel horizontal con snap, tarjeta al 85 % del ancho para que asome la siguiente. Botón de WhatsApp siempre visible dentro de la tarjeta.
- **CTA asociado:** WhatsApp con mensaje predefinido `salida` (incluye nombre y fecha).

### 3.5 Cómo es viajar con Explora Siam — "Un día cualquiera"

- **Objetivo:** hacer sentir el ritmo del viaje. Es la sección que convierte curiosos en gente que se imagina allí.
- **Mensaje principal:** así es un día de verdad, hora a hora.
- **Copy orientativo:**
  - H2: **"Un martes cualquiera en el norte."**
  - Seis paradas con hora en mono, título y una frase:
    - `06:30` — **Niebla en Doi Inthanon.** "Subimos antes de que llegue nadie. Hace frío. Sí, en Tailandia."
    - `08:15` — **Desayuno en el mercado.** "Khao soi en un puesto que lleva 30 años. Yo pido, tú pruebas."
    - `11:00` — **Un templo sin autobuses.** "El monje que nos abre lleva viéndome años."
    - `14:00` — **Tiempo libre.** "Siesta, masaje, o perderte. Nos vemos a las seis."
    - `18:00` — **La hora del río.** "Cerveza, sobremesa larga y planes para mañana."
    - `21:30` — **Mercado nocturno.** "Y esto sin guía. Ya sabes moverte."
- **Contenido visual:** una imagen por parada, en formato panorámico 16:9 en desktop y 4:5 en mobile, con el texto encima en la esquina inferior izquierda.
- **Desktop:** sección con **scroll horizontal controlado**: la sección se fija ("pin") y las seis paradas se desplazan lateralmente con el scroll vertical. Es el único gran efecto de la web y se merece el protagonismo.
- **Mobile:** sin pin. Lista vertical con la hora como columna izquierda fija (sticky) y las imágenes pasando. Mismo contenido, cero complejidad.
- **CTA:** al final de la línea, una tarjeta final oscura: "¿Te lo imaginas? Cuéntamelo." → WhatsApp `dia`.

### 3.6 Quién está detrás — "La carta"

- **Objetivo:** confianza personal. Convertir al fundador en garantía.
- **Mensaje principal:** una persona con nombre, cara e historia, que va en cada viaje y contesta ella misma.
- **Copy orientativo:**
  - Kicker: `QUIÉN TE ACOMPAÑA`
  - H2: **"Hola, soy Daniel."** (el nombre lo decide el cliente; usar siempre el de pila)
  - Cuerpo, tres párrafos cortos en primera persona: cuándo fue la primera vez a Tailandia, por qué sigue yendo, qué ha aprendido, y una línea de compromiso: "En cada viaje voy yo. No delego el grupo en nadie."
  - Firma manuscrita (SVG) bajo el texto. Es el único recurso manual de la web.
  - Datos en mono debajo: `Santander / Chiang Mai` · `Agencia de viajes combinados registrada` · `Hablo tailandés de mercado y de cocina`.
- **Contenido visual:** retrato de calidad, luz natural, en Tailandia, mirando a cámara o riéndose con alguien local. No retrato de estudio. Segunda foto pequeña, "de archivo", de un viaje antiguo, con esquina y pie de foto.
- **Desktop:** imagen a la izquierda 5/12 a sangre por el borde, texto a la derecha con margen amplio. Fondo tinta selva con texto marfil: es el primer bloque oscuro y marca un cambio de ritmo.
- **Mobile:** retrato a ancho completo 4:5, luego el texto.
- **CTA:** botón "Escríbeme" → WhatsApp `daniel` (mensaje en tono de presentación).

### 3.7 Galería inmersiva — "Lo que verás"

- **Objetivo:** deseo visual sostenido. Es donde el visitante "se va" a Tailandia unos segundos.
- **Mensaje principal:** ninguno en texto. La imagen manda.
- **Copy orientativo:** kicker `DEL ÚLTIMO VIAJE · MAYO 2026` y pies de foto cortos en mono en cada imagen (`Sukhothai, 7:10 am`, `Tren nocturno a Chiang Mai`).
- **Contenido visual:** entre 9 y 12 piezas mezclando fotos verticales, horizontales y dos o tres vídeos cortos silenciosos (5 a 8 segundos, loop, se reproducen al entrar en viewport). Todas del mismo grading.
- **Desktop:** grid editorial asimétrico de 12 columnas (una imagen a 8 col, dos a 4, una a 12 a sangre, etc.), con ligeras diferencias de velocidad de parallax entre columnas (2 % a 5 %). Al hacer clic, lightbox a pantalla completa con pie de foto.
- **Mobile:** columna única con dos anchos alternos (a sangre y con margen), sin parallax, vídeos con `playsinline` y `muted`.
- **CTA:** al pie, enlace "Más en Instagram →" y botón secundario de WhatsApp.

### 3.8 Testimonios — "Lo que dicen los que ya han ido"

- **Objetivo:** prueba social con cara. Reducir el riesgo percibido.
- **Mensaje principal:** gente real, con nombre, ciudad y viaje, que vuelve a repetir.
- **Copy orientativo:**
  - H2: **"Vuelven, y eso lo dice todo."**
  - Cada testimonio: cita de 2 a 4 líneas (mejor concreta que superlativa: "El día de Sukhothai sin nadie más lo recordaré siempre"), nombre y ciudad, viaje y fecha, foto del viajero en Tailandia. Si hay reseñas de Google, enlace "Ver en Google" con la nota.
- **Contenido visual:** fotos reales de los viajeros hechas en el viaje (no avatares). Una cita grande "destacada" en Fraunces cursiva a 48 px con la foto detrás en duotono verde.
- **Desktop:** un testimonio destacado a ancho completo + tres en tarjetas debajo. Rotación cada 8 segundos del destacado, con controles.
- **Mobile:** carrusel con snap.
- **CTA:** ninguno directo. Enlace a la fuente de reseñas si existe.

### 3.9 Qué incluye — "Sin letra pequeña"

- **Objetivo:** despejar la duda de precio y hacer tangible el valor.
- **Mensaje principal:** todo lo importante está incluido y lo que no, se dice.
- **Copy orientativo:** dos columnas. `INCLUIDO`: alojamiento (hoteles pequeños con carácter, 3–4★), todos los traslados internos, vuelos internos, X comidas, todas las entradas, guía-anfitrión todo el viaje, seguro de viaje, grupo de WhatsApp pre-viaje. `NO INCLUIDO`: vuelos internacionales (te ayudo a elegirlos), visado si aplica, comidas libres, propinas.
- **Contenido visual:** sin iconos. Listas con guiones en mono y un pequeño detalle: la lista "incluido" lleva un check en oro, la "no incluido" un guion.
- **Desktop:** bloque compacto sobre marfil, dos columnas, con una foto pequeña en la tercera columna.
- **Mobile:** columnas apiladas, "no incluido" en un acordeón cerrado.
- **CTA:** "¿Dudas del precio? Pregúntame" → WhatsApp `precio`.

### 3.10 Preguntas frecuentes — "Lo que me preguntan siempre"

- **Objetivo:** resolver objeciones y captar SEO de cola larga.
- **Mensaje principal:** respuestas honestas y cortas.
- **Copy orientativo (8 preguntas, editables):** ¿Viajo solo/a y no conozco a nadie? · ¿Qué nivel físico hace falta? · ¿Cuándo es la mejor época? · ¿Cómo se reserva y se paga? · ¿Qué pasa si se cancela? · ¿Se puede alargar el viaje por mi cuenta? · ¿Y si no como picante? · ¿Cómo funciona el WhatsApp del grupo?
- **Contenido visual:** ninguno. Tipografía y espacio. Números en mono a la izquierda.
- **Desktop:** dos columnas 4/8 (título a la izquierda sticky, acordeones a la derecha).
- **Mobile:** una columna. Un acordeón abierto a la vez.
- **CTA:** al pie: "¿Otra pregunta? Es lo que mejor hago." → WhatsApp `faq`.

### 3.11 CTA final — "La conversación"

- **Objetivo:** cerrar. Es el bloque con mayor densidad de deseo + confianza + inmediatez.
- **Mensaje principal:** escribir no compromete a nada y te contesta la misma persona que viaja contigo.
- **Copy orientativo:**
  - H2 grande: **"Cuéntame qué viaje tienes en la cabeza."**
  - Sub: "Te contesto yo, normalmente en menos de 24 horas. Sin formularios, sin llamadas comerciales."
  - Botón: **"Abrir WhatsApp"** con el número visible debajo en mono y una segunda vía: `info@explorasiam.com`.
  - Nota de confianza: "Si prefieres correo o llamada, también vale. Pero por WhatsApp te mando fotos."
- **Contenido visual:** fondo tinta selva con foto de atardecer en el río en duotono muy oscuro; retrato pequeño circular del fundador junto al botón, con el punto verde "disponible" (real: se activa en horario configurado desde el CMS).
- **Desktop:** bloque a pantalla completa (90 vh).
- **Mobile:** 70 svh, botón a ancho completo.
- **CTA asociado:** WhatsApp `final`.

### 3.12 Footer

- Logo, frase de cierre ("Vive Tailandia de una forma diferente", que ya usan y es buena), Instagram, email, teléfono, enlaces legales, "Agencia de viajes combinados · Licencia XX" cuando exista, y una línea en mono con la ubicación: `Santander · Chiang Mai`.

### 3.13 Barra móvil persistente

Después de pasar el hero, en mobile aparece una barra inferior de 56 px con "Hablemos por WhatsApp" a ancho completo y, si hay salida próxima, una línea encima: `Norte de Tailandia · 12 nov · 4 plazas`. Se oculta al abrir acordeones o el lightbox.

---

## 4. Dirección de arte y UI

### 4.1 Estilo general

Editorial contemporáneo sobre marfil: papel claro como escenario, tinta selva para los bloques que necesitan peso (fundador, CTA final), verde templo como color de marca en enlaces, botones secundarios y detalles, oro con cuentagotas. La fotografía es el único elemento "de color" real; la interfaz nunca compite con ella.

### 4.2 Grid, composición y aire

- Grid de **12 columnas**, contenedor máximo **1440 px**, márgenes laterales de **clamp(20px, 5vw, 96px)**.
- Ritmo vertical base de **8 px**; espaciado entre secciones de **clamp(96px, 12vw, 200px)**. Las secciones no se tocan.
- **Asimetría deliberada:** texto en 5–7 columnas, imágenes que rompen el contenedor por un lado (a sangre a la derecha, con margen a la izquierda). La simetría centrada solo en el CTA final.
- Titulares con **ancho máximo de 14 a 18 palabras**; párrafos a **62 caracteres** de línea como máximo.
- Un solo elemento "a sangre completa" por cada dos pantallas.

### 4.3 Hero

- Vídeo o imagen a pantalla completa, degradado vertical de tinta (55 % abajo, 15 % arriba), titular en Fraunces a `clamp(40px, 6.5vw, 104px)`, tracking `-0.02em`, interlineado `0.98`.
- Kicker en mono a 12 px con tracking `0.14em`, en oro.
- Fila de datos inferior en mono a 13 px, con separadores `·`.
- Nada de flechas animadas grandes ni "scroll down" con rebote. Una línea vertical de 1 px que crece y se contrae en 2 s, con la palabra `scroll` en mono, basta.

### 4.4 Tarjetas y bloques

- Tarjetas de salida: **sin sombra**, borde de 1 px `rgba(16,34,28,0.12)`, radio **4 px**, imagen sin radio interior (a sangre dentro de la tarjeta), contenido con padding 24/28 px. En hover, la imagen escala 1.03 en 600 ms y el borde pasa a verde templo.
- Bloques de texto: sin cajas. Separación por espacio y líneas de 1 px, como en una revista.
- Badges (plazas, grupo completo): fondo laterita o tinta, texto marfil en mono 11 px, radio 2 px, sin sombra.

### 4.5 Botones y CTAs

| Tipo | Estilo | Uso |
|---|---|---|
| Primario WhatsApp | Fondo tinta selva `#10221C`, texto marfil, icono de WhatsApp en línea 20 px a la izquierda, altura 56 px, padding 0 28px, radio 999 px (píldora), tracking `0.01em`. Hover: fondo verde templo, icono con "rebote" de 4 px. | Hero, salidas, CTA final, barra móvil |
| Secundario | Solo borde 1 px tinta, texto tinta, misma altura. Hover: relleno tinta. | "Ver próximas salidas", "Ver itinerario" |
| Terciario / enlace | Texto verde templo con subrayado de 1 px que se desplaza 2 px en hover, flecha `→` que avanza 4 px. | Enlaces dentro del texto |
| Flotante WhatsApp | Círculo 56 px tinta con icono marfil; al pasar 3 s en la página o al hacer hover, se expande a píldora con "¿Hablamos?" | Desktop solamente |

Regla: **no se usa el verde de WhatsApp (#25D366) como color de botón.** El icono ya lo identifica. Un botón verde chillón rompe la paleta y huele a plugin.

### 4.6 Iconografía

Casi ninguna. Cuando haga falta (menú, cerrar, flecha, play, WhatsApp, Instagram), trazo de 1.5 px, esquinas redondeadas, 20 o 24 px, mismo color que el texto. **Prohibido** el grid de "ventajas" con icono + título + texto. Las ventajas se cuentan con cifras y con fotos.

### 4.7 Imágenes y vídeo

- **Grading unificado:** sombras ligeramente verdes, altas luces cálidas, saturación al 90 %, sin HDR. Se entrega un preset (Lightroom/Capture One) para que todo el material futuro encaje.
- **Grano fino** (2 a 3 %) en imágenes grandes para unificar orígenes distintos (móvil, cámara).
- **Pies de foto** en mono siempre que la foto sea protagonista: lugar y hora. Esto es marca.
- **Duotono verde-tinta** solo en fondos detrás de texto (testimonio destacado, CTA final).
- **Vídeo:** silencioso, loop, 8–12 s, sin logos ni texto quemado, planos fijos con movimiento interno.

### 4.8 Overlays, degradados, glass, texturas

- **Degradados:** solo lineales verticales de tinta sobre foto, para legibilidad. Nunca degradados de color a color como fondo.
- **Glass:** una sola vez, en la barra de navegación al hacer scroll (blur 12 px, fondo marfil al 80 %).
- **Texturas:** grano en imágenes. Ninguna textura de papel en el fondo (eso es la dirección C).
- **Recursos editoriales que sí:** pies de foto, numeración `01 · 02 · 03`, líneas de 1 px, capitular opcional en la carta del fundador, palabras en cursiva dentro de titulares.

### 4.9 Reglas anti-plantilla y anti "AI slop"

1. Ninguna sección de tres iconos con tres párrafos.
2. Ningún degradado violeta/azul, ninguna sombra difusa de color, ningún "glow".
3. Ninguna foto de stock. Si no hay foto propia de algo, no se enseña.
4. Ningún titular que empiece por "Descubre", "Vive", "Sumérgete", "Embárcate".
5. Los testimonios llevan foto real o no llevan foto. Nada de avatares generados.
6. Un solo efecto de scroll grande (la sección horizontal). Lo demás, reveals discretos.
7. Nada de contadores animados que suben desde cero.
8. Los radios se mantienen pequeños (2–4 px) salvo en botones (píldora). Nada de tarjetas con radio 24 px.
9. Máximo dos familias tipográficas más la mono. Ningún texto con degradado.
10. El diseño tiene que poder imprimirse en una revista y no parecer una web.

### 4.10 Especificaciones concretas

**Tipografías para Astro** (todas con licencia libre, servidas localmente vía `@fontsource-variable`, `font-display: swap`, subset latin):

| Rol | Familia | Pesos / ejes | Uso |
|---|---|---|---|
| Display | *Fraunces* (variable) | 300–700, ejes `opsz`, `SOFT` 30–60, `WONK` 0 en UI, 1 en titulares grandes | H1, H2, cita destacada, cifras |
| Texto y UI | *Instrument Sans* (variable) | 400–600 | Párrafos, botones, navegación, tarjetas |
| Etiquetas | *Geist Mono* o *JetBrains Mono* | 400, 500 | Kickers, fechas, pies de foto, datos |

**Escala tipográfica** (fluida, `clamp`):

| Nivel | Tamaño | Interlineado | Familia |
|---|---|---|---|
| H1 hero | `clamp(40px, 6.5vw, 104px)` | 0.98 | Fraunces 400, opsz 144 |
| H2 sección | `clamp(32px, 4.2vw, 64px)` | 1.05 | Fraunces 400, cursiva parcial |
| H3 tarjeta | `clamp(22px, 2vw, 28px)` | 1.2 | Fraunces 500 |
| Lead | `clamp(18px, 1.4vw, 22px)` | 1.5 | Instrument Sans 400 |
| Cuerpo | 17 px (16 en mobile) | 1.65 | Instrument Sans 400 |
| Etiqueta | 12–13 px, tracking 0.12em, mayúsculas | 1.4 | Mono 500 |
| Cifra | `clamp(36px, 3vw, 48px)` | 1 | Fraunces 300 |

**Colores** (tokens CSS):

| Token | Valor | Rol |
|---|---|---|
| `--c-marfil` | `#F4EFE6` | Fondo base |
| `--c-marfil-2` | `#EBE4D6` | Fondo alterno, bordes suaves |
| `--c-tinta` | `#10221C` | Texto principal, botones, bloques oscuros |
| `--c-tinta-2` | `#1B322A` | Fondos oscuros secundarios |
| `--c-verde` | `#1F5A46` | Marca, enlaces, hover primario |
| `--c-oro` | `#C9A24B` | Kickers, checks, detalles (máx. 3 % de la pantalla) |
| `--c-laterita` | `#B8563A` | Badges de urgencia, un único acento cálido |
| `--c-gris` | `#6B7470` | Texto secundario sobre marfil |
| `--c-linea` | `rgba(16,34,28,0.12)` | Bordes y separadores |

Contrastes verificados: tinta sobre marfil 14.6:1; marfil sobre tinta 14.6:1; verde sobre marfil 6.9:1; oro sobre tinta 6.4:1 (solo en tamaños ≥ 12 px con peso 500).

**Radios, sombras, bordes, ritmo, microinteracciones:**

- Radios: 2 px (badges), 4 px (tarjetas, inputs), 999 px (botones, avatar).
- Sombras: ninguna, salvo el botón flotante (`0 8px 24px rgba(16,34,28,0.18)`) y el lightbox.
- Bordes: siempre 1 px, siempre `--c-linea`. Al hover, `--c-verde`.
- Ritmo: 8 px base; alturas de sección múltiplo de 8; separación entre kicker y H2 de 16 px; entre H2 y lead de 24 px.
- Microinteracciones (todas 200–600 ms, curva `cubic-bezier(0.22, 1, 0.36, 1)`): subrayado que se desplaza en enlaces, flecha que avanza 4 px, imagen que escala 1.03 en tarjetas, icono de WhatsApp que "salta" 4 px en hover del botón, acordeón con rotación de `+` a `×`, botón que se oscurece 8 % al pulsar (`:active`).

---

## 5. Motion y experiencia interactiva

### 5.1 Animaciones en scroll (las que sí)

| Elemento | Efecto | Parámetros |
|---|---|---|
| Titulares H2 | Fade + subida de 24 px, por líneas (split en líneas, no en letras) | 700 ms, stagger 60 ms, una vez |
| Párrafos y listas | Fade + subida de 16 px | 600 ms, una vez |
| Imágenes | Reveal por `clip-path: inset(0 0 100% 0)` a `inset(0)` + escala de 1.08 a 1 | 900 ms |
| Tarjetas de salida | Fade + subida, stagger 90 ms | 600 ms |
| Cifras de confianza | Fade simple, sin contador | 500 ms |
| Sección "Un martes cualquiera" (desktop) | Pin de la sección y scroll horizontal ligado al scroll vertical; progreso marcado por una línea de 1 px | Longitud de scroll = 6 pantallas |
| Barra de navegación | Cambio de transparente a marfil con blur | 250 ms al superar 80 px |

### 5.2 Parallax y reveal (dónde sí)

- **Parallax:** hero (fondo al 30 % de la velocidad, se desactiva en mobile), imagen del manifiesto (6 %), columnas de la galería (2 % a 5 % con diferencias entre columnas), foto de fondo del CTA final (4 %). **En ningún otro sitio.**
- **Reveal:** todas las imágenes grandes y todos los titulares. Los textos de cuerpo con un reveal más corto para no ralentizar la lectura.

### 5.3 Vídeo sin penalizar rendimiento

- Hero: `<video autoplay muted loop playsinline preload="metadata" poster="...">` con dos fuentes: **AV1 o VP9 en WebM** y **H.264 en MP4**, 1920×1080, 24 fps, 8–12 s, **≤ 2,5 MB** cada uno (bitrate ~1.8 Mbps). El póster es la primera imagen del vídeo, servida como AVIF/WebP y con `fetchpriority="high"`: el LCP lo hace la imagen, no el vídeo.
- En mobile (`< 768px`) o con `prefers-reduced-data`, **no se carga el vídeo**: se sirve la foto vertical. Se decide con una `media` query en el `<source>` y una comprobación de `navigator.connection.saveData`.
- Vídeos de la galería: se cargan con `IntersectionObserver` cuando entran al 25 % del viewport y se pausan al salir. Nunca más de dos reproduciéndose a la vez.
- Nada de YouTube/Vimeo embebidos en la home (iframe pesado, cookies). Si en el futuro hay un vídeo largo, facade con póster y carga del iframe al hacer clic.

### 5.4 Transiciones elegantes

- **Entre páginas** (cuando existan fichas de viaje): View Transitions nativas de Astro, con la foto de la tarjeta "viajando" a hero de la ficha (`transition:name` por viaje). Es el efecto más premium que existe y cuesta tres líneas.
- **Lightbox de la galería:** escala desde la miniatura, fondo tinta al 96 %, pie de foto en mono, cierre con `Esc` y gesto.
- **Acordeones:** altura animada con `grid-template-rows: 0fr → 1fr`, 350 ms.
- **Menú móvil:** desliza desde arriba, las tres anclas entran con stagger de 80 ms.

### 5.5 Qué NO animar

- Texto de cuerpo mientras se lee (nada de letras que aparecen una a una fuera del hero).
- Botones en reposo (nada de pulsos, brillos ni "shine").
- Cifras (nada de contadores).
- Fondos (nada de partículas, blobs, degradados que se mueven).
- Cursor personalizado: no. Rompe accesibilidad y en 2026 ya cansa.
- Scroll suave por librería (Lenis y similares): no por defecto. Solo si el equipo de desarrollo lo prueba con la sección horizontal y no introduce jank en Safari iOS. El scroll nativo es más rápido y accesible.
- Parallax en mobile: nunca.

### 5.6 Mobile-first y accesibilidad

- Todo se diseña primero a 390 px. Las versiones desktop añaden, no adaptan.
- `prefers-reduced-motion: reduce` desactiva parallax, pin horizontal (pasa a lista vertical), reveals (contenido visible desde el principio) y autoplay de vídeo.
- Objetivos táctiles de 44 px mínimo; botón principal de 56 px.
- Contraste AA en todos los textos, AAA en cuerpo.
- Foco visible de 2 px en verde con offset de 3 px, en todos los elementos interactivos.
- Orden de tabulación lógico; la sección horizontal es navegable con teclado (cada parada es un elemento focusable que desplaza la pista).
- Textos alternativos descriptivos y editables desde el CMS; el pie de foto y el `alt` son campos distintos.
- Vídeos sin audio, así que no requieren subtítulos; si algún día lo tienen, pista `<track>` obligatoria.
- Presupuesto de rendimiento: LCP < 2,0 s en 4G, CLS < 0,05, INP < 200 ms, JS total en home < 60 KB comprimido, peso de la home en primera carga < 1,2 MB en mobile.

---

## 6. Conversión y WhatsApp

### 6.1 Integración elegante y no intrusiva

- **No hay chat widget de terceros** (nada de burbujas con "¡Hola! ¿En qué puedo ayudarte?" que salta a los 3 segundos). El botón flotante es propio, de marca, y abre WhatsApp directamente.
- **Desktop:** círculo de 56 px en tinta abajo a la derecha, con icono de WhatsApp en marfil. A los 3 segundos de permanencia se expande una vez a píldora con "¿Hablamos?" durante 4 segundos y vuelve a círculo. En hover se vuelve a expandir. Se oculta mientras el hero está en pantalla (el hero ya tiene su CTA) y en el CTA final.
- **Mobile:** no hay botón flotante. Hay **barra inferior fija** de 56 px que aparece al superar el hero, con "Hablemos por WhatsApp" y, si existe salida próxima, una línea de contexto encima. Se oculta al abrir acordeones, lightbox o menú.
- **Enlace técnico:** `https://wa.me/34605330654?text=<mensaje codificado>` (el número publicado en la página de contacto actual). En desktop abre WhatsApp Web; en mobile la app. El número se edita desde el CMS.
- **Perfil de WhatsApp Business:** nombre "Explora Siam · Daniel", foto real, descripción, horario, catálogo con las salidas activas (mismo nombre y precio que la web), mensaje de bienvenida y de ausencia, y respuestas rápidas para las 8 preguntas de la FAQ. Esto es lo que hoy hace de "chatbot" sin pagar una plataforma.

### 6.2 Puntos de aparición del CTA

| Punto | Tipo | Mensaje predefinido |
|---|---|---|
| Navegación | Botón compacto | `nav` |
| Hero | Primario | `hero` |
| Manifiesto | Solo enlace a galería (sin WA) | — |
| Cada tarjeta de salida | Primario dentro de tarjeta | `salida` (con nombre y fecha) |
| Final de la sección horizontal | Tarjeta oscura | `dia` |
| Carta del fundador | Botón "Escríbeme" | `daniel` |
| Galería (pie) | Secundario | `galeria` |
| Qué incluye | Enlace | `precio` |
| FAQ (pie) | Enlace | `faq` |
| CTA final | Primario grande | `final` |
| Flotante / barra móvil | Persistente | `flotante` |

Once puntos parecen muchos, pero solo cuatro son botones primarios (hero, tarjetas, carta, final). El resto son enlaces de texto en el flujo de lectura. La regla es: **una acción principal por pantalla, nunca dos botones primarios a la vista.**

### 6.3 Mensajes predefinidos (editables desde el CMS)

Cada mensaje identifica el origen para que el fundador sepa qué ha visto el visitante, sin que parezca un código:

- `hero`: "Hola Daniel, he visto la web de Explora Siam y me gustaría saber más sobre los viajes a Tailandia."
- `salida`: "Hola Daniel, me interesa el viaje *{nombre}* del *{fechas}*. ¿Quedan plazas? Me gustaría saber más."
- `dia`: "Hola Daniel, me he imaginado ese 'martes cualquiera' en el norte y quiero saber cómo sería el viaje completo."
- `daniel`: "Hola Daniel, acabo de leer tu carta en la web. Me gustaría contarte el viaje que tengo en la cabeza."
- `galeria`: "Hola Daniel, he visto las fotos del último viaje y quiero saber cuándo es el siguiente."
- `precio`: "Hola Daniel, tengo una duda sobre el precio y lo que incluye el viaje."
- `faq`: "Hola Daniel, tengo una pregunta que no está en las FAQ de la web:"
- `final`: "Hola Daniel, quiero contarte el viaje que tengo en la cabeza. Somos {n} personas y pensábamos en {mes}." (los huecos son para que el visitante rellene; se explica en el microcopy).
- `flotante` / `nav`: "Hola Daniel, estoy en la web de Explora Siam y me gustaría hablar contigo."

### 6.4 Microcopys que suben conversión

- Bajo el botón del hero: `Te contesta Daniel, no un bot.`
- Bajo el botón de tarjeta: `Sin compromiso. Te cuento y decides.`
- En la carta: `Respondo yo, normalmente en menos de 24 h.` (editable; si el horario está activo, `Ahora mismo estoy disponible`.)
- En el CTA final: `Escribir no reserva nada. Solo empieza la conversación.`
- En "Qué incluye": `El precio que ves es el precio. Sin suplementos sorpresa.`
- Estado de plazas: `Quedan 4 plazas` en laterita a partir de ≤ 3; `Grupo completo` en tinta tachada.
- En la barra móvil: `Norte de Tailandia · 12 nov · 4 plazas` encima del botón.
- Página de error 404: `Esto no está en el mapa. Vuelve a la home o escríbeme.`

### 6.5 Deseo + confianza + inmediatez

La fórmula por sección: **cada CTA de WhatsApp está a menos de una pantalla de una imagen que provoca deseo y de un dato que da confianza.** Ejemplos:

- Hero: vídeo (deseo) + fila de datos con fecha y plazas (confianza) + botón (inmediatez).
- Tarjeta: foto (deseo) + precio, grupo, incluye (confianza) + botón (inmediatez).
- CTA final: atardecer (deseo) + retrato y "menos de 24 h" (confianza) + botón (inmediatez).

Medición: eventos GA4 (`whatsapp_click` con parámetro `origen`), y en el propio WhatsApp el texto del mensaje ya dice de dónde viene. Con eso se sabe qué sección convierte y se itera.

### 6.6 Chatbot: qué sí y qué no ahora

- **Fase 1 (lanzamiento):** WhatsApp Business App con bienvenida, ausencia, respuestas rápidas y catálogo. Cero coste, cero desarrollo, tono humano. Es lo correcto para un proyecto de una persona: la gracia es que conteste Daniel.
- **Fase 2 (si el volumen lo pide):** WhatsApp Cloud API de Meta con un asistente que cualifica (destino, fechas, cuántas personas, presupuesto) y pasa el hilo al fundador. Puede hacerse con un pequeño servicio serverless (el equipo ya tiene experiencia con la Cloud API en otro proyecto) y un modelo de lenguaje con el contexto de las salidas activas leído del mismo CMS. Se activa solo fuera de horario o cuando Daniel está de viaje.

---

## 7. Arquitectura técnica recomendada

### 7.1 Visión general

```
Visitante ──► Vercel (CDN + edge) ──► Astro (estático + islas)
                                          │
                                          ├─ /keystatic  (panel de edición, ruta SSR protegida)
                                          │        └─► commits en GitHub (contenido + imágenes)
                                          │                    └─► redeploy automático (60–90 s)
                                          ├─ /api/contacto (endpoint opcional → Resend)
                                          └─ wa.me links   (WhatsApp, sin backend)
```

### 7.2 Opciones de CMS valoradas

| Opción | Pros | Contras | Veredicto |
|---|---|---|---|
| **Keystatic** (git-based, panel en la propia web) | Integración oficial con Astro; contenido en YAML/MDX dentro del repo; panel visual con campos tipados, imágenes, listas ordenables; gratuito; sin base de datos; modo "cloud" opcional para que el cliente entre con email sin cuenta de GitHub | Cada guardado es un commit y un despliegue (1–2 min hasta verse); no hay previsualización en vivo; un solo editor a la vez es lo cómodo | **Recomendado** |
| Decap CMS (git-based) | Gratuito, maduro | UI anticuada, configuración en YAML frágil, peor experiencia con imágenes | Descartado |
| Sanity | Mejor editor del mercado, preview en vivo, multiusuario, CDN de imágenes | Otra plataforma con su login, curva de aprendizaje, plan de pago cuando se crece, contenido fuera del repo | Alternativa si en el futuro hay varios editores o un blog serio |
| Storyblok / Prismic | Editor visual | Coste mensual, sobredimensionado para una landing | Descartado |
| Supabase + panel a medida | Control total | Hay que construir y mantener el panel; sin sentido para textos e imágenes | Descartado |
| Markdown a mano en el repo | Cero infraestructura | El cliente no va a editar YAML ni subir imágenes por Git | Descartado como única vía (aunque es lo que Keystatic genera por debajo) |
| WordPress headless | El cliente ya lo conoce | Mantener WP solo para editar es pagar hosting, plugins y seguridad por nada | Descartado |

### 7.3 Por qué Keystatic para este caso

1. **El cliente edita en su propia web** (`explorasiam.com/keystatic`), con formularios claros: título, texto, imagen, lista de salidas. No aprende otra herramienta.
2. **Cero coste y cero infraestructura** que mantener: no hay base de datos, no hay plan mensual, el contenido vive en el repositorio y está versionado (se puede deshacer cualquier cambio).
3. **Rendimiento máximo:** la web se genera estática; el CMS no participa en el tiempo de carga.
4. **Un solo editor y pocos cambios al mes** (nuevas salidas, testimonios, fotos): el modelo "guardar = publicar en un minuto" es suficiente y hasta deseable.
5. **Escala sin cambiar de sistema:** colecciones nuevas (viajes, entradas de blog, guías) son un archivo de esquema más.

Si en el futuro hay un equipo editando a diario o se quiere previsualización en vivo, la migración a Sanity es mecánica porque el contenido ya está tipado y estructurado.

### 7.4 Stack

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Astro 5** con `output: 'static'` y la ruta de Keystatic en SSR (`prerender = false`) vía adaptador de Vercel | HTML estático para todo lo público, JS solo en las islas que lo necesitan |
| Estilos | **CSS propio con tokens** (o Tailwind v4 si el equipo lo prefiere), sin librería de componentes | Evita la estética de plantilla; el sistema es pequeño |
| Contenido | **Keystatic** + Content Collections de Astro con esquemas tipados (Zod) | Validación en build: si falta un campo obligatorio, no se despliega roto |
| Interactividad | Web Components ligeros o islas de **Svelte/Preact** para: carrusel, acordeón, lightbox, barra móvil, botón flotante | < 15 KB cada isla, hidratación `client:visible` |
| Motion | **Motion** (motion.dev, ~5 KB para scroll y reveals) + `IntersectionObserver` nativo; GSAP ScrollTrigger solo para la sección horizontal si Motion no la resuelve con calidad | Mínimo JS |
| Imágenes | `astro:assets` con Sharp: AVIF + WebP, `srcset` por densidad y ancho, `loading="lazy"` salvo LCP | Optimización en build, cero servicio externo |
| Vídeo | Archivos MP4/WebM comprimidos servidos desde `/public` en Vercel CDN; si crecen (> 10 vídeos), **Bunny Stream** o **Cloudflare Stream** | Simplicidad primero |
| Formulario (opcional) | Endpoint Astro `/api/contacto` → **Resend** al email del cliente, con honeypot y rate limit | Sin proveedor de formularios de terceros |
| Analítica | **GA4** con Consent Mode v2 + banner propio mínimo, o **Plausible** si se prefiere evitar cookies | Cumplimiento y ligereza |
| Hosting | **Vercel** (Pro no necesario al inicio) | Integración directa con GitHub, adaptador Astro oficial, edge CDN, previews por rama |
| Dominio y DNS | Cloudflare como DNS (proxy desactivado o activado, ambos válidos) | SSL, redirecciones, protección |
| Repositorio | GitHub, rama `main` = producción, PRs con preview | El cliente edita vía Keystatic; el equipo vía código |

### 7.5 Estructura de contenido editable

```
content/
  site.yaml                 # singleton: nombre, WhatsApp, email, Instagram, horario, SEO global
  home.yaml                 # singleton: hero, franja, manifiesto, día cualquiera, fundador, incluye, CTA final
  salidas/                  # colección: una por salida
    norte-profundo-nov-2026.yaml
  testimonios/              # colección
  faqs/                     # colección
  galeria.yaml              # singleton: lista ordenable de imágenes y vídeos
  legal/                    # colección MDX: aviso legal, privacidad, cookies, condiciones
public/
  media/                    # imágenes y vídeos subidos desde Keystatic
```

Rutas públicas de la fase 1: `/` (home), `/viajes/[slug]` (ficha de salida generada desde la colección, aunque en la primera versión sea sencilla), `/aviso-legal`, `/privacidad`, `/cookies`, `/condiciones`, `/404`.

### 7.6 Campos editables que necesitará el cliente

Se detallan en la tabla del apartado 8. Resumen por nivel de frecuencia de edición:

- **Cada pocos meses:** salidas (crear, fechas, plazas, precio, estado), testimonios, fotos de galería.
- **Una o dos veces al año:** textos del hero, manifiesto, carta del fundador, FAQ, qué incluye.
- **Casi nunca:** datos de contacto, SEO global, legales.

### 7.7 SEO

- Home con un solo `<h1>` y jerarquía de `h2` por sección; las secciones con anclas (`#salidas`, `#como-viajamos`, `#preguntas`) para sitelinks.
- Datos estructurados JSON-LD: `TravelAgency` (con `founder`, `areaServed`, `telephone`, `sameAs` Instagram), un `TouristTrip` por salida activa (nombre, fechas, `offers` con precio y disponibilidad), `FAQPage` con las preguntas, `ImageObject` con pies de foto en la galería.
- Título y descripción por página desde el CMS, con valores por defecto: `Explora Siam · Viajes de autor a Tailandia en grupo reducido`.
- Open Graph e imagen social generada por salida (Satori en build: foto + nombre + fechas).
- **Redirecciones 301** desde las URLs actuales de WordPress: `/contact/` → `/#contacto`, `/services/` → `/`, `/hello-world/` → `/`, y las legales a sus nuevas rutas. Se mantiene el dominio y el sitemap se regenera.
- Sitemap y `robots.txt` automáticos (`@astrojs/sitemap`).
- Textos alternativos obligatorios en el CMS para toda imagen que no sea decorativa.
- Estrategia de contenido posterior: fichas de viaje con itinerario día a día (cola larga: "viaje organizado Tailandia norte grupo reducido"), y más adelante guías cortas ("mejor época para viajar al norte de Tailandia"). El blog no se lanza en fase 1: un blog vacío resta.

### 7.8 Rendimiento

- Presupuestos del apartado 5.6. Se verifican en CI con Lighthouse (`@lhci/cli`) en cada PR; falla por debajo de 90 en Performance móvil.
- Fuentes: tres archivos variables en WOFF2, subset latin, precargados los dos que pintan el hero.
- Sin CSS de terceros, sin jQuery, sin Font Awesome, sin Google Maps embebido.
- Imagen LCP con `fetchpriority="high"` y dimensiones explícitas; el resto `lazy` y con `decoding="async"`.
- HTML estático en CDN edge; TTFB < 100 ms en Europa.

### 7.9 Gestión de imágenes y vídeos

- El cliente sube imágenes desde Keystatic (campo de imagen con recorte de aspecto sugerido). Se guardan en `public/media` y Astro genera los tamaños en build. Límite recomendado por imagen: 4000 px de lado largo, JPG de calidad 85; el build produce AVIF/WebP.
- Se entrega al cliente un **preset de color** y una **guía de una página**: qué fotos funcionan (luz natural, personas, verticales), qué tamaño subir, cómo nombrar.
- Vídeo: el cliente entrega el archivo; el equipo lo comprime (ffmpeg, dos formatos, póster) y lo sube. Si en fase 2 el cliente quiere subir vídeos él mismo, se integra Bunny Stream con un campo de URL en el CMS.
- Nombre de archivo y `alt` se rellenan en el CMS; el `alt` es obligatorio para publicar.

### 7.10 Formularios

Fase 1: **no hay formulario en la home**. WhatsApp y email visible son suficientes y evitan spam y fricción. Si el cliente lo quiere como red de seguridad, se pone en el CTA final un enlace "Prefiero escribir un correo" que abre un formulario mínimo (nombre, email, mensaje) que envía por Resend, con honeypot, sin captcha visible. Nunca compite con el botón de WhatsApp.

### 7.11 Integración de WhatsApp

- Enlaces `wa.me` con `text` codificado, generados desde un único componente `<WhatsAppLink origen="salida" salida={...}>` que lee número y plantillas del CMS.
- Evento GA4 `whatsapp_click` con `origen` y `salida` en cada clic.
- Horario de disponibilidad en el CMS (`lun–vie 9–20 CET`) que activa el punto verde "disponible" del CTA final y la variante de microcopy. Sin backend: se calcula en el cliente con la zona horaria.
- Fase 2: webhook de WhatsApp Cloud API en un endpoint Astro SSR o función serverless, para cualificación automática fuera de horario.

### 7.12 Hosting y despliegue

- GitHub → Vercel: cada push a `main` despliega; cada PR genera una preview con URL. Keystatic hace commits directos a `main` (o a una rama `contenido` con auto-merge, si se prefiere revisar).
- Dominio en Vercel con SSL automático; `www` redirige a raíz (o al revés, pero una sola).
- Copias de seguridad: el repositorio es la copia. Se puede volver a cualquier versión del contenido.
- Coste mensual estimado de infraestructura: **0 €** (Vercel Hobby, Keystatic, GitHub) hasta que el tráfico o el uso comercial exijan Vercel Pro (20 €/mes). Dominio y WhatsApp Business ya los tiene el cliente.

---

## 8. Mapa de contenidos editable

Tipos de dato: `texto` (línea), `texto largo` (párrafos, sin formato), `rich` (párrafos con negrita, cursiva, enlaces), `imagen` (con `alt` obligatorio), `vídeo` (archivo o URL), `número`, `fecha`, `select`, `lista` (repetible y ordenable), `booleano`, `url`.

| Bloque | Campo | Tipo | Ejemplo | Oblig. |
|---|---|---|---|---|
| **Sitio** | Nombre de marca | texto | Explora Siam | Sí |
| Sitio | Nombre del fundador | texto | Daniel | Sí |
| Sitio | Número de WhatsApp (internacional) | texto | 34605330654 | Sí |
| Sitio | Email | texto | info@explorasiam.com | Sí |
| Sitio | Instagram | url | https://instagram.com/explora_siam | Sí |
| Sitio | Horario de disponibilidad | texto | Lun–vie 9:00–20:00 | Opcional |
| Sitio | Mostrar punto "disponible" | booleano | true | Opcional |
| Sitio | Ubicaciones (footer) | texto | Santander · Chiang Mai | Opcional |
| Sitio | Licencia / registro de agencia | texto | Agencia de viajes combinados · Nº XXXX | Opcional |
| Sitio | Título SEO por defecto | texto | Explora Siam · Viajes de autor a Tailandia | Sí |
| Sitio | Descripción SEO por defecto | texto largo | Viajes a Tailandia en grupo reducido… | Sí |
| Sitio | Imagen social por defecto | imagen | og-default.jpg | Sí |
| Sitio | Logo (versión verde) | imagen | logo-green.svg | Sí |
| Sitio | Logo (versión blanca) | imagen | logo-white.svg | Sí |
| **Mensajes WhatsApp** | Plantilla por origen (hero, salida, dia, daniel, galeria, precio, faq, final, flotante) | lista de {origen: select, texto: texto largo} | "Hola Daniel, me interesa el viaje {nombre}…" | Sí |
| **Hero** | Kicker | texto | Viajes de autor · Tailandia · Grupos de 8 a 12 | Sí |
| Hero | Titular (H1) | texto | Tailandia como no te la va a enseñar ninguna agencia. | Sí |
| Hero | Palabra(s) en cursiva del titular | texto | ninguna agencia | Opcional |
| Hero | Subtítulo | texto largo | Salidas en grupo reducido diseñadas y acompañadas por mí… | Sí |
| Hero | Texto botón primario | texto | Cuéntame tu viaje por WhatsApp | Sí |
| Hero | Microcopy bajo botón | texto | Te contesta Daniel, no un bot. | Opcional |
| Hero | Texto botón secundario | texto | Ver próximas salidas | Opcional |
| Hero | Vídeo de fondo (MP4) | vídeo | hero-doi-inthanon.mp4 | Opcional |
| Hero | Vídeo de fondo (WebM) | vídeo | hero-doi-inthanon.webm | Opcional |
| Hero | Imagen de fondo desktop (póster) | imagen | hero-poster.jpg | Sí |
| Hero | Imagen de fondo mobile (vertical) | imagen | hero-mobile.jpg | Sí |
| Hero | Mostrar próxima salida en el pie | booleano | true | Opcional |
| **Franja de confianza** | Ítems | lista de {cifra: texto, etiqueta: texto} (máx. 4) | "12" / "personas como máximo" | Sí |
| **Manifiesto** | Titular | texto | No es un circuito. Es un viaje de verdad… | Sí |
| Manifiesto | Palabra(s) en cursiva | texto | un viaje de verdad | Opcional |
| Manifiesto | Bloques | lista de {numero: texto, titulo: texto, texto: texto largo} (3) | 01 / Sin autobús de 50 / Vamos en grupos… | Sí |
| Manifiesto | Imagen | imagen | mercado-warorot.jpg | Sí |
| Manifiesto | Pie de foto | texto | Mercado de Warorot, Chiang Mai, 6:40 am | Opcional |
| Manifiesto | Texto del enlace | texto | Así fue el último viaje | Opcional |
| **Salidas** (colección) | Nombre del viaje | texto | Norte profundo: Chiang Mai, Pai y Doi Inthanon | Sí |
| Salidas | Slug | texto | norte-profundo-nov-2026 | Sí |
| Salidas | Fecha inicio | fecha | 2026-11-12 | Sí |
| Salidas | Fecha fin | fecha | 2026-11-26 | Sí |
| Salidas | Duración (texto) | texto | 15 días / 14 noches | Sí |
| Salidas | Plazas totales | número | 12 | Sí |
| Salidas | Plazas disponibles | número | 4 | Sí |
| Salidas | Estado | select (abierta / últimas plazas / completa / próximamente) | abierta | Sí |
| Salidas | Precio desde (€) | número | 2890 | Sí |
| Salidas | Nota de precio | texto | vuelos internacionales no incluidos | Opcional |
| Salidas | Highlights | lista de texto (3) | Amanecer en Doi Inthanon | Sí |
| Salidas | Imagen principal (4:5) | imagen | norte-nov-2026.jpg | Sí |
| Salidas | Imagen social (OG) | imagen | og-norte.jpg | Opcional |
| Salidas | Descripción corta | texto largo | Quince días por el norte… | Sí |
| Salidas | Itinerario | lista de {dia: número, titulo: texto, texto: rich, imagen: imagen} | 1 / Llegada a Bangkok / … | Opcional |
| Salidas | Incluye (si difiere del general) | lista de texto | | Opcional |
| Salidas | No incluye (si difiere) | lista de texto | | Opcional |
| Salidas | Destacada en home | booleano | true | Opcional |
| Salidas | Orden | número | 1 | Opcional |
| **Un día cualquiera** | Titular | texto | Un martes cualquiera en el norte. | Sí |
| Un día cualquiera | Paradas | lista de {hora: texto, titulo: texto, texto: texto largo, imagen: imagen} (5–7) | 06:30 / Niebla en Doi Inthanon / … | Sí |
| Un día cualquiera | Texto de la tarjeta final | texto | ¿Te lo imaginas? Cuéntamelo. | Sí |
| **Fundador** | Kicker | texto | Quién te acompaña | Sí |
| Fundador | Titular | texto | Hola, soy Daniel. | Sí |
| Fundador | Carta | rich | La primera vez que fui a Tailandia… | Sí |
| Fundador | Retrato | imagen | daniel-retrato.jpg | Sí |
| Fundador | Foto de archivo | imagen | daniel-2014.jpg | Opcional |
| Fundador | Pie de la foto de archivo | texto | Chiang Rai, 2014 | Opcional |
| Fundador | Firma (SVG) | imagen | firma.svg | Opcional |
| Fundador | Datos en mono | lista de texto (máx. 3) | Santander / Chiang Mai | Opcional |
| Fundador | Texto del botón | texto | Escríbeme | Sí |
| Fundador | Microcopy | texto | Respondo yo, normalmente en menos de 24 h. | Opcional |
| **Galería** | Kicker | texto | Del último viaje · Mayo 2026 | Opcional |
| Galería | Piezas | lista de {tipo: select (imagen/vídeo), archivo: imagen o vídeo, alt: texto, pie: texto, tamaño: select (pequeño/grande/sangre)} (9–12) | imagen / sukhothai.jpg / … / Sukhothai, 7:10 am / grande | Sí |
| Galería | Texto enlace Instagram | texto | Más en Instagram | Opcional |
| **Testimonios** (colección) | Cita | texto largo | El día de Sukhothai sin nadie más… | Sí |
| Testimonios | Nombre | texto | Marta | Sí |
| Testimonios | Ciudad | texto | Bilbao | Opcional |
| Testimonios | Viaje y fecha | texto | Norte profundo · Mayo 2026 | Sí |
| Testimonios | Foto | imagen | marta-sukhothai.jpg | Opcional |
| Testimonios | Destacado | booleano | true | Opcional |
| Testimonios | URL de la reseña original | url | https://g.page/… | Opcional |
| Testimonios (bloque) | Titular de la sección | texto | Vuelven, y eso lo dice todo. | Sí |
| Testimonios (bloque) | Enlace a reseñas y nota | {url: url, texto: texto} | Ver en Google · 5,0 | Opcional |
| **Qué incluye** | Titular | texto | Sin letra pequeña. | Sí |
| Qué incluye | Incluido | lista de texto | Alojamiento en hoteles pequeños con carácter | Sí |
| Qué incluye | No incluido | lista de texto | Vuelos internacionales (te ayudo a elegirlos) | Sí |
| Qué incluye | Microcopy | texto | El precio que ves es el precio. | Opcional |
| Qué incluye | Imagen | imagen | hotel-pai.jpg | Opcional |
| Qué incluye | Texto enlace WhatsApp | texto | ¿Dudas del precio? Pregúntame | Opcional |
| **FAQ** (colección) | Pregunta | texto | ¿Viajo solo y no conozco a nadie? | Sí |
| FAQ | Respuesta | rich | La mitad del grupo suele venir sola… | Sí |
| FAQ | Orden | número | 1 | Opcional |
| FAQ (bloque) | Titular | texto | Lo que me preguntan siempre. | Sí |
| FAQ (bloque) | Texto enlace final | texto | ¿Otra pregunta? Es lo que mejor hago. | Opcional |
| **CTA final** | Titular | texto | Cuéntame qué viaje tienes en la cabeza. | Sí |
| CTA final | Subtítulo | texto largo | Te contesto yo, normalmente en menos de 24 horas… | Sí |
| CTA final | Texto botón | texto | Abrir WhatsApp | Sí |
| CTA final | Microcopy | texto | Escribir no reserva nada. | Opcional |
| CTA final | Nota alternativa | texto | Si prefieres correo o llamada, también vale. | Opcional |
| CTA final | Imagen de fondo | imagen | rio-atardecer.jpg | Sí |
| CTA final | Mostrar formulario de correo | booleano | false | Opcional |
| **Navegación** | Anclas | lista de {texto: texto, ancla: texto} (máx. 4) | Salidas / #salidas | Sí |
| Navegación | Texto botón WhatsApp | texto | Hablemos por WhatsApp | Sí |
| **Barra móvil / flotante** | Texto | texto | Hablemos por WhatsApp | Sí |
| Barra móvil / flotante | Texto expandido (desktop) | texto | ¿Hablamos? | Opcional |
| Barra móvil / flotante | Mostrar próxima salida | booleano | true | Opcional |
| **Footer** | Frase de cierre | texto | Vive Tailandia de una forma diferente | Opcional |
| Footer | Enlaces legales | lista de {texto, url} | Aviso legal / /aviso-legal | Sí |
| **Legales** (colección MDX) | Título y cuerpo | rich | | Sí |
| **404** | Titular y texto | texto | Esto no está en el mapa. | Opcional |

---

## 9. Prompt para generación de diseño UI

Se entrega en inglés porque las herramientas de generación visual (Midjourney, Figma AI, v0, Galileo, Relume, Stitch) responden con más precisión en inglés; el copy que debe aparecer en pantalla va en español dentro del prompt. Usar el bloque completo; para herramientas con límite de caracteres, el primer párrafo más las secciones "Art direction", "Sections" y "Avoid" son el mínimo.

```
Design a premium, editorial homepage for "Explora Siam", a one-person author-led travel brand offering small-group journeys (8–12 travelers) through Thailand, designed and personally hosted by its founder. Spanish-speaking audience, 30–55, experienced travelers who want the real Thailand with everything taken care of. Primary conversion: start a WhatsApp conversation. The site must feel like a well-made travel magazine issue about Thailand, not a travel agency template and not a SaaS landing.

BRAND & TONE
- Positioning: "the trip you'd take with a friend who lives there, run with the seriousness of a registered agency".
- Voice: first-person host, warm, concrete, honest. Calm confidence, not adrenaline. No superlatives.
- Perceived values: Thailand · small · trustworthy.

VISUAL INSPIRATION LEVEL
Quiet-luxury travel editorial: Cereal magazine layouts, Monocle travel guides, Black Tomato and Scott Dunn journey pages, Kinfolk photography rhythm. Contemporary, unhurried, image-led, with generous whitespace and large serif headlines.

ART DIRECTION
- Base: warm ivory paper (#F4EFE6). Dark blocks in deep jungle ink (#10221C). Brand green (#1F5A46) for links, secondary buttons and details. Antique gold (#C9A24B) used sparingly for kickers, small checks and captions (max 3% of any screen). One warm accent, laterite red (#B8563A), only for "last seats" badges. Secondary text grey (#6B7470). Hairlines rgba(16,34,28,0.12).
- Typography: display serif "Fraunces" (variable, optical sizes, slight softness, occasional italic words inside headlines), text/UI sans "Instrument Sans", small monospace labels "Geist Mono" for kickers, dates, seats, photo captions (uppercase, 12–13px, letter-spacing 0.12em). Hero H1 ~96–104px desktop / 40px mobile, line-height 0.98, tracking -0.02em. Section H2 ~64px. Body 17px, line-height 1.65, max 62 characters per line.
- Layout: 12-column grid, max width 1440px, side margins 5vw, section spacing 120–200px. Deliberately asymmetric: text in 5–7 columns, images breaking the container on one side (full-bleed right, margin left). At most one full-bleed element every two screens. Small radii (2–4px) on cards, pill buttons. No drop shadows except the floating WhatsApp button.
- Photography: real, natural light, morning mist in Doi Inthanon, Sukhothai ruins with nobody around, Chiang Mai morning markets, night trains, river at dusk, monks, people photographed from behind or mid-action. Unified color grade: slightly green shadows, warm highlights, 90% saturation, fine 2–3% film grain. Many vertical 4:5 frames. Every hero image gets a monospace caption "Place, time" (e.g. "Mercado de Warorot, Chiang Mai, 6:40 am").
- Video: silent 8–12s loops, static frames with internal motion (mist, water, smoke, fabric, traffic). Hero only, plus 2–3 small loops in the gallery.
- Editorial devices allowed: numbered blocks "01 · 02 · 03", 1px hairlines, photo captions, italic words inside serif headlines, one handwritten SVG signature under the founder's letter. Nothing else handmade.
- Overlays: only vertical linear gradients of ink over photos for legibility (55% bottom → 15% top). Glass blur only on the sticky nav after scroll.

SECTIONS (in this order; keep the Spanish copy)
1. Nav: logo, three anchors (Salidas · Cómo viajamos · Preguntas), pill button "Hablemos por WhatsApp" with WhatsApp glyph. Transparent over hero, ivory + blur after 80px.
2. Hero, 100vh full-bleed video/photo (mist rising over Doi Inthanon). Kicker in gold mono: "VIAJES DE AUTOR · TAILANDIA · GRUPOS DE 8 A 12". H1 in Fraunces, left-aligned, 60% width: "Tailandia como no te la va a enseñar ninguna agencia." Subline: "Salidas en grupo reducido diseñadas y acompañadas por mí, con las rutas que llevo años recorriendo. Tú traes las ganas; del resto me encargo yo." Primary pill button (ink bg, ivory text, WhatsApp glyph): "Cuéntame tu viaje por WhatsApp", microcopy under it "Te contesta Daniel, no un bot." Ghost button "Ver próximas salidas". Bottom-left mono data row: "Próxima salida · Norte de Tailandia · 12 nov 2026 · 4 plazas". Bottom-right: a thin 1px vertical line with the word "scroll".
3. Trust strip on ivory: four figures in Fraunces light 40px with mono labels, hairline separators, no icons: "12 / personas como máximo", "6 / viajes desde 2021", "Agencia registrada / de viajes combinados", "Yo / voy en cada viaje".
4. Manifesto, two columns 7/5: H2 "No es un circuito. Es un viaje de verdad con alguien que sabe dónde parar." with "un viaje de verdad" in italic; three numbered blocks (01 · SIN AUTOBÚS DE 50, 02 · LO QUE NO SALE EN EL PAQUETE, 03 · TIEMPO PARA TI) with two-line paragraphs; right column a tall 4:5 photo of a person in a morning market, caption "Mercado de Warorot, Chiang Mai, 6:40 am".
5. Upcoming departures ("Próximas salidas"): kicker, H2 "Elige cuándo.", subline "Dos o tres salidas al año. Cuando un grupo se llena, se llena." Three cards: 4:5 photo on top (60% of card), ivory info area: trip name "Norte profundo: Chiang Mai, Pai y Doi Inthanon", mono row "12 – 26 nov 2026 · 15 días · máx. 12 · quedan 4", price "desde 2.890 € · vuelos no incluidos", three one-line highlights, primary pill "Quiero este viaje", text link "Ver itinerario día a día →". One card shows a laterite badge "ÚLTIMAS PLAZAS", one shows a struck-through "GRUPO COMPLETO" with link "Avísame de la próxima". Cards: 1px hairline border, 4px radius, no shadow.
6. "Un martes cualquiera en el norte." A horizontal, pinned timeline of six moments, each a 16:9 photo with a mono time stamp and a short title/line in the bottom-left corner: 06:30 Niebla en Doi Inthanon · 08:15 Desayuno en el mercado · 11:00 Un templo sin autobuses · 14:00 Tiempo libre · 18:00 La hora del río · 21:30 Mercado nocturno. Ends with a dark ink card: "¿Te lo imaginas? Cuéntamelo." + WhatsApp pill.
7. Founder letter on deep ink background, ivory text: kicker "QUIÉN TE ACOMPAÑA", H2 "Hola, soy Daniel.", three short first-person paragraphs, handwritten SVG signature, mono facts "Santander / Chiang Mai · Agencia de viajes combinados registrada", button "Escríbeme" with microcopy "Respondo yo, normalmente en menos de 24 h." Left 5/12: full-bleed natural-light portrait of the founder laughing with a local vendor; a small archival photo with a corner and caption "Chiang Rai, 2014".
8. Immersive gallery: kicker "DEL ÚLTIMO VIAJE · MAYO 2026", asymmetric 12-col editorial grid of 10 pieces mixing vertical and horizontal photos and two silent video loops, one full-bleed piece, mono captions like "Sukhothai, 7:10 am", "Tren nocturno a Chiang Mai". Footer link "Más en Instagram →".
9. Testimonials: H2 "Vuelven, y eso lo dice todo." One featured quote in Fraunces italic 48px over a dark green-ink duotone photo, then three cards with a real traveler photo taken in Thailand, quote, "Marta · Bilbao · Norte profundo, mayo 2026". Optional "Ver en Google · 5,0" link.
10. "Sin letra pequeña.": two mono lists (INCLUIDO with small gold checks / NO INCLUIDO with dashes), microcopy "El precio que ves es el precio.", link "¿Dudas del precio? Pregúntame".
11. FAQ "Lo que me preguntan siempre.": 4/8 columns, sticky title left, eight accordions right with mono numbers, + rotating to × when open. Footer link "¿Otra pregunta? Es lo que mejor hago."
12. Final CTA, 90vh, ink background with a very dark duotone river-at-dusk photo: H2 "Cuéntame qué viaje tienes en la cabeza.", subline "Te contesto yo, normalmente en menos de 24 horas. Sin formularios, sin llamadas comerciales.", large primary pill "Abrir WhatsApp" with a small round founder avatar and a green "disponible" dot next to it, number and email in mono below, microcopy "Escribir no reserva nada. Solo empieza la conversación."
13. Footer: logo, "Vive Tailandia de una forma diferente", Instagram, email, phone, legal links, mono "Santander · Chiang Mai".
Mobile: hero uses a vertical photo instead of video; departures become a snap carousel at 85% width; the timeline becomes a vertical list with a sticky time column; a fixed 56px bottom bar "Hablemos por WhatsApp" with a context line "Norte de Tailandia · 12 nov · 4 plazas" appears after the hero.

UX RULES
- One primary action per screen; never two primary buttons visible at once. All primary buttons open WhatsApp with a pre-filled Spanish message.
- WhatsApp buttons never use WhatsApp green; ink pill + white glyph. Floating button on desktop only (56px ink circle, expands once to "¿Hablamos?").
- Scarcity only when real: seat counts, "Grupo completo" left visible and struck through.
- Photo captions everywhere a photo is the hero of a block.
- 44px minimum tap targets, AA contrast, visible focus rings in brand green.

MOTION (indicate in the mockup with annotations, do not exaggerate)
- Line-by-line fade-up on headlines (700ms, 60ms stagger), clip-path reveal on images with 1.08→1 scale, subtle parallax (≤6%) only on hero, manifesto image, gallery columns and final CTA. One big effect: the pinned horizontal timeline on desktop. Nav to ivory+blur on scroll. Nothing else moves. Respect reduced-motion.

AVOID (hard constraints)
- No three-icon "why choose us" grids, no icon+title+text feature blocks, no Lucide/FontAwesome icon rows.
- No stock photography, no generated faces, no avatars, no beaches with lounge chairs, no elephants, no tuk-tuk clichés.
- No purple/blue gradients, no glows, no colored soft shadows, no glassmorphism cards, no 24px-radius cards, no gradient text.
- No animated counters, no cursor effects, no particles, no floating blobs.
- No headlines starting with "Descubre", "Vive", "Sumérgete" or "Embárcate".
- No WhatsApp-green buttons, no third-party chat bubble widgets.
- No centered symmetric layouts except the final CTA.
- It must look like it could be printed as a magazine spread.

OUTPUT
Desktop (1440px) full-page composition of all sections, plus a 390px mobile version of the hero, departures carousel, timeline list and bottom WhatsApp bar. Show real Spanish copy as written above, real-looking photography per the art direction, and annotate motion lightly in the margins.
```

---

## 10. Entrega final

### Recomendación estratégica principal

Construir Explora Siam como **marca de viajes de autor a Tailandia**, con el fundador como garantía visible y WhatsApp como único canal de conversión. Abandonar cualquier lenguaje de "agencia" y de "descubre/vive". Enseñar precio, fechas, plazas e itinerario: en este nicho la transparencia es la forma más rentable de parecer premium. Lanzar con una sola página muy buena y fichas de viaje sencillas; no lanzar blog ni secciones vacías.

### Stack recomendado

**Astro 5** (estático, islas mínimas, View Transitions) + **Keystatic** (CMS git-based con panel en `/keystatic`, contenido tipado en el repositorio) + **Vercel** (despliegue automático desde GitHub, previews) + **`astro:assets`** para imágenes + vídeo comprimido servido desde el CDN (Bunny Stream si crece) + **wa.me** con plantillas desde el CMS y eventos GA4 + WhatsApp Business App en fase 1, Cloud API con asistente de cualificación en fase 2 + **Resend** solo si se activa el formulario de respaldo. Coste de infraestructura al inicio: cero.

### Concepto visual recomendado

**"Crónica de Siam"**: editorial contemporáneo sobre marfil, tipografía Fraunces + Instrument Sans + mono para etiquetas, paleta tinta selva / verde templo / oro chedi / laterita, fotografía real con grading unificado y pies de foto, un hero cinematográfico con vídeo silencioso, un único gran efecto de scroll (la jornada horizontal) y una única firma manuscrita. Todo lo demás, quieto y bien compuesto.

### Estructura de homepage recomendada

1. Navegación mínima con CTA de WhatsApp
2. Hero con vídeo, postura y próxima salida
3. Franja de confianza (cuatro hechos)
4. Manifiesto "No es un circuito"
5. Próximas salidas (tarjetas con fecha, plazas, precio)
6. "Un martes cualquiera" (jornada horizontal)
7. Carta del fundador (bloque oscuro)
8. Galería inmersiva con vídeo
9. Testimonios con cara
10. Qué incluye, sin letra pequeña
11. Preguntas frecuentes
12. CTA final de conversación
13. Footer + barra móvil persistente

### Siguientes pasos, en orden

1. **Sesión de contenido con el cliente (1 semana):** confirmar nombre del fundador, salidas 2026–2027 con fechas, plazas y precios, qué incluye, licencia de agencia, cifras reales para la franja de confianza, 3–5 testimonios con permiso y foto, y las 8 FAQ. Sin esto no hay web.
2. **Auditoría de material gráfico (1 semana, en paralelo):** inventario de fotos y vídeos existentes; selección de 30 fotos y 3 vídeos candidatos; aplicar el preset de color; encargar, si hace falta, un retrato del fundador y un hero de vídeo en el próximo viaje (con un brief de 10 planos concretos).
3. **Wireframes de baja fidelidad de la home en mobile y desktop (1 semana):** validar orden, longitud y copy definitivo con el cliente. Es más barato discutir aquí que en diseño.
4. **Diseño de alta fidelidad (2 semanas):** sistema de tokens, hero, tarjeta de salida, jornada horizontal, carta, CTA final; después el resto. Usar el prompt del apartado 9 para explorar variantes rápidas antes de refinar a mano.
5. **Build (3 semanas):** proyecto Astro, esquemas de Keystatic, componentes, motion, WhatsApp, SEO técnico, redirecciones desde WordPress, Lighthouse en CI.
6. **Carga de contenido y formación (3 días):** el cliente rellena el CMS con acompañamiento; guía de una página sobre fotos y salidas; configurar WhatsApp Business (bienvenida, respuestas rápidas, catálogo).
7. **QA y lanzamiento (1 semana):** pruebas en iOS/Android reales, accesibilidad, rendimiento, redirecciones, datos estructurados, cambio de DNS, apagado de WordPress.
8. **Primer mes en producción:** revisar eventos `whatsapp_click` por origen, ajustar mensajes y microcopys, añadir fichas de viaje completas con itinerario, y decidir con datos si hace falta el asistente de WhatsApp de fase 2.
