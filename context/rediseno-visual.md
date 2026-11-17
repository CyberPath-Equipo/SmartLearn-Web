# Sistema visual de SmartLearn Web

## Revisión oscura — 17 de noviembre de 2026

La dirección del último documento adjunto reemplaza la interfaz clara anterior. Se conserva Vue, la tipografía local DM Sans, los logotipos y los colores originales #254ca8 y #07acda. No hay selector de tema.

La capa común sigue en `vue-frontend/src/assets/styles/visual-system.css`. Fondo azul carbón #0d1520, superficies #172331, títulos #edf3f8, texto secundario #a9bacb, bordes #2a3b4e y enlaces #65d3ed. Los fondos ambientales son estáticos y discretos. El contenido informativo conserva su texto. No se añadieron dependencias.

## Presentación e interacción

- Inicio: composición partida, jerarquía tipográfica y secciones con separadores; fotografías y logotipos existentes.
- Navbar, footer, formularios y paneles: superficies oscuras, acciones cian, foco visible y estados semánticos diferenciados.
- `ProductGallery.vue`: cinco capturas originales de `images/imagen (1–5).jpeg`, copiadas sin alteración a `public/images`. Se integran en ¿Qué es Smart Learn?, completas y sin recorte, con controles, indicadores, teclado y desplazamiento táctil nativo. Sin reproducción automática.
- El menú conserva su transición breve y el cambio del icono hamburguesa. Los botones mantienen feedback de presión y hover para puntero fino. Las entradas decorativas repetidas y el movimiento automático del navegador de temas se retiraron. `prefers-reduced-motion` desactiva transiciones; el carrusel también consulta la preferencia desde JavaScript.
- `router/index.js` incorpora exclusivamente `scrollBehavior`: navegación nueva o repetida al inicio, anclas con espacio para la cabecera y restauración al retroceder. Desplazamiento inmediato para evitar recorridos largos y movimiento innecesario. Definiciones de rutas y guardias intactas.
- Footer: misión, accesibilidad y guía móvil apuntan a sus secciones. Los IDs de las secciones se ubican al comienzo del bloque, no a mitad de la composición.

## Verificación y límites

Build original mediante `npm.cmd run build`: correcto. Permanece la advertencia de bundles mayores a 500 kB. No se modificaron backend, autenticación, peticiones, stores, dependencias ni algoritmos académicos.

Comprobaciones de código: igualdad de rutas y guardias contra HEAD anterior, casos de inicio/ancla/ancla inexistente/historial, identidad binaria de las cinco imágenes y contraste de pares principales. Texto secundario/superficie 8.00:1; títulos/superficie 14.21:1; acción cian/texto oscuro 6.11:1; enlace/fondo azul 8.07:1. Estas mediciones no constituyen una auditoría WCAG completa.

Pendiente revisión visual real en escritorio y móvil, navegación repetida, foco y gestos. Computer Use se detuvo porque no pudo verificar la URL de Chrome en Windows. No se utilizó Playwright ni se afirma validación visual.

## Ajuste de cabecera y ancho completo

La cabecera pública usa el símbolo blanco original sin recuadro azul, con mayor tamaño y enlaces de texto. La página activa tiene una línea cian, sin pastillas. El menú hamburguesa aparece bajo 1280px para evitar comprimir las etiquetas. Las secciones públicas ocupan todo el ancho y usan márgenes internos adaptables; los formularios conservan su medida. El emblema de beneficios móviles es blanco. La llamada de lanzamiento usa tonos oscuros fijos, separados del token de texto, para asegurar contraste. Sin cambios de scripts, rutas ni contenido informativo.


## Ajuste a tarjetas compactas

Por preferencia posterior del usuario, las secciones p?blicas vuelven a tarjetas de radio 16px, con borde sutil, m?rgenes exteriores de 12?28px y separaci?n de 16?20px. El espacio interior se adapta entre 24 y 44px (18px lateral en m?vil). Se elimina la altura m?nima forzada de la portada. La cabecera refinada, los logos blancos y los colores se conservan. Cambio exclusivamente CSS.
