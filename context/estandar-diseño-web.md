(Documento creado)

SmartLearn Web — Diseño responsivo y accesible (móvil y escritorio)  
Markdown · 12 KB  

# SmartLearn Web — Diseño responsivo y accesible

**SmartLearn** es la plataforma educativa de CyberPath. **SmartLearn Web** es el frontend del sistema, implementado con **Vue 3**, **JavaScript**, **Vite**, **Axios**, **Pinia**, **Vue Router** y **ApexCharts**. El backend es Spring Boot 3.3 (Java 17) con Spring Security 6 y JWT; la API se sirve desde `https://smartlearn.westus.cloudapp.azure.com/smartlearn/api`. El frontend está desplegado en Cloudflare Pages.

> **Alcance:** Este documento define las directrices para hacer SmartLearn Web **100% responsiva y accesible** en móviles y PCs. **Solo se permiten cambios estéticos del frontend** (HTML/CSS y aspectos visuales). Cualquier cambio de lógica, endpoints, seguridad, backend, etc., requiere consulta previa con el equipo. Los desarrolladores deben revisar la documentación interna `.md` existente para entender el contexto completo del proyecto.

## Arquitectura general y pila tecnológica

- **Frontend:** SPA con Vue 3, Vue Router y Pinia. Comunicación con backend vía Axios a la API `/smartlearn/api`. Despliegue en Cloudflare Pages.
- **Backend:** Spring Boot (Java 17, Spring Security 6, JWT). Base de datos MySQL con JPA/Hibernate. Servidor principal en Azure.
- **Infraestructura:** Frontal web servido por Spring Boot en `smartlearn.westus.cloudapp.azure.com/smartlearn`. Base API en `…/api`. Frontend alojado en Cloudflare Pages.
- **Tecnologías:** HTML5 semántico, CSS3 (Flexbox, Grid), JavaScript moderno (ES6+) y Vue 3. Uso de WAI-ARIA para roles en componentes interactivos (solo cuando no existe elemento nativo).

## Principios de diseño responsive (mobile-first)

- **Mobile-First:** Diseñar primero para pantallas pequeñas, luego ampliar. Enfocarse en lo esencial: menús simples, flujos de usuario cortos, evitar elementos innecesarios en móvil.
- **Meta viewport:** Incluir `<meta name="viewport" content="width=device-width, initial-scale=1">` para que el navegador móvil use el ancho real del dispositivo. Esto evita el zoom automático de escritorio en móviles.
- **Unidades relativas:** Usar `%`, `vw/vh`, `em`, `rem` en lugar de valores absolutos. Tipografía fluida mediante `clamp()` o mezclas de unidades (`calc()`) para escalar sin discontinuidades.
- **Grillas flexibles:** Construir layouts con Flexbox y/o CSS Grid. Estos módulos manejan adaptaciones automáticamente. Por ejemplo, tres columnas con `display: grid; grid-template-columns: 1fr 1fr 1fr;` que responden a cambios de ancho. Ajustar valores de `flex-grow/flex-shrink` para columnas flexibles.
- **Breakpoints basados en contenido:** Definir `@media (min-width: Xpx)` donde el diseño “se rompa”. Ejemplos típicos: 
  ```css
  @media (min-width: 600px) { /* tablet */
    /* diseño de 2 columnas */
  }
  @media (min-width: 900px) { /* escritorio */
    /* diseño de más columnas */
  }
  ```
  Evitar basar solo en dimensiones de dispositivo conocidas; preferir los puntos donde el texto o las imágenes se comprimen.
- **Imágenes y multimedia responsivas:** Asegurar que `img`, `picture`, `video` sean fluidos (`max-width: 100%; height: auto;`) para no romper el contenedor. Emplear `<picture>` o `srcset` para servir distintas resoluciones según viewport.
- **Contenido reorganizable:** En móvil, algunos componentes pueden colapsarse o reubicarse. Ejemplos: un menú lateral fijo en desktop se convierte en hamburguesa desplegable en móvil; tablas de datos anchas pueden pasar a vista apilada o scroll horizontal; paneles secundarios (ads, info) pueden ocultarse bajo “Leer más”.
- **Eventos táctiles:** No usar interacciones dependientes únicamente de hover (no existe en móvil). En su lugar, usar eventos `click/tap` o gestos conocidos. Evitar acciones como “hover para descripción” sin equivalente táctil. Los elementos interactivos deben ser accesibles con un solo toque.
- **Objetivos táctiles:** Los botones e íconos clicables deben medir al menos 24×24 CSS px (éxito AA). Para comodidad, se recomienda 44×44 px (criterio AAA). Por ejemplo, un botón de acción móvil puede tener 40–44px de lado mínimo.
- **Formularios táctiles:** Inputs, selects, radios y checkboxes grandes, con suficiente padding. Asociar cada `<label>` correctamente. Evitar campos de texto muy angostos o icons pequeños sin zona de toque ampliada.
- **Fluidez y jerarquía visual:** Simplificar disposición en móvil (única columna) para enfocar al usuario. Mantener la jerarquía de información clara con tamaños de fuente crecientes y negritas para títulos.
- **Navegación adaptada:** En PC se puede mostrar menú completo en barra superior. En móvil, sustituir por un botón “☰ Menú” (hamburguesa) que despliegue navegación vertical. Este botón debe tener un `aria-label` descriptivo y manejar `aria-expanded` cuando abre/cierra el menú. Incluir un enlace “Saltar al contenido” al inicio para usuarios de teclado/screen readers.

## Accesibilidad (WCAG 2.2 y WAI-ARIA)

- **Reflow y zoom (SC 1.4.10):** El contenido debe acomodarse sin perder información al redimensionar hasta 400% en pantallas pequeñas. No debe aparecer scroll horizontal en móviles. El texto debe ser legible y reflujo vertical. 
- **Contraste de color (SC 1.4.3/1.4.11):** Texto normal con contraste mínimo 4.5:1 con el fondo; texto grande (≥24px) mínimo 3:1. Componentes UI e íconos mínimo 3:1. En modo oscuro, usar texto claro sobre fondos muy oscuros, asegurando ≥4.5:1; preferir 7:1 para texto pequeño. No depender del color solo para transmitir información (usar iconos o texto adicional).
- **Textos reescalables:** Garantizar line-height ≥1.5, amplio espaciado de párrafos (2× altura de línea) y tracking/amplitud de palabra recomendados (según SC 1.4.12). Esto facilita la lectura de personas con baja visión.
- **Navegación por teclado (SC 2.1.1/2.1.2):** Toda funcionalidad debe ser accesible con teclado. No dejar elementos interactivos no enfocable (uso de `tabindex`). No crear “trampas de teclado”: si un modal/panel abre, al cerrarlo el foco debe regresar al elemento original. Indicar claramente con outline el elemento enfocado.
- **Roles ARIA y semántica:** Usar elementos HTML nativos siempre que sea posible (`<button>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<label>`, etc.). Solo emplear `role="..."` cuando no exista el elemento adecuado. Recuerda: un rol es una promesa de funcionalidad. Por ejemplo, un `<div role="button">` debe tener manejadores de teclado equivalentes. Seguir patrones ARIA para widgets comunes (acordeones, menús, diálogos) según la [Guía de Authoring Practices de WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.2).
- **Nombres accesibles (SC 2.5.3):** El nombre (texto accesible) de un componente debe incluir el mismo texto que se ve visualmente. Por ejemplo, un botón con etiqueta debe tener esa etiqueta en su `aria-label`. Esto es crucial para botones con iconos.
- **Alertas y diálogos:** Usar `role="alert"` o `role="dialog"` con `aria-modal="true"` para modales. Al abrir un diálogo, enfocar el primer campo. Al cerrarlo, devolver el foco al control original.
- **Ayudas móviles:** Aunque WAI-ARIA 2.3 no define totalmente patrones táctiles nuevos, se debe probar la interfaz en dispositivos táctiles y asegurarse de que eventos touch (tap, scroll) funcionen correctamente.
- **Objetivos táctiles (SC 2.5.8 y 2.5.5):** Al menos 24×24 CSS px (nivel AA), preferiblemente 44×44 px. Esto protege a usuarios con movilidad reducida o dedos grandes. Las excepciones (espacios o controles alternativos) deben documentarse.
- **Input simultáneo (SC 2.5.6):** No restringir tipos de entrada; si un usuario puede usar teclado o voz, no bloquear esas opciones salvo necesidad de seguridad.
- **Gestos de arrastre (SC 2.5.7):** Si se requieren arrastrar elementos, proporcionar alternativa sin arrastre (por ejemplo, botones para ajustar).
- **Zoom y ampliación:** No impedir el zoom del navegador. El diseño debe soportar hasta 400% de escala con reflujo (sin rompimientos).
- **Focus visible:** Mantener un estilo claro (outline o sombra) en el foco de teclado. No anularlo.
- **Formularios y validación:** Incluir `label` asociados a inputs. Mensajes de error claros, con atributos `aria-invalid` y `aria-describedby`. SC 3.3.3 y 3.3.7 (sugerencias de errores) se aplican si es necesario.
- **Transporte de contenido:** Asegurar que tablas de datos sean accesibles (uso de `<th>`, `scope`, o atributos `aria-label`). Las gráficas deben tener descripciones alternativas (texto o aria-label) para usuarios no videntes.

## Identidad visual (tema oscuro)

La identidad de SmartLearn Web será **tema oscuro** accesible. Recomendaciones de paleta:

- **Fondo:** Gris muy oscuro en lugar de negro puro (e.g. `#121212`), para reducir fatiga ocular. Superficies de tarjetas/líneas con un gris ligeramente más claro (`#1E1E1E`). Evitar fondo negro absoluto para no aumentar contraste de atenuación.
- **Texto:** Blanco puro o casi (`#FFFFFF` o `#E0E0E0`) para texto principal. Texto secundario en gris claro (`#CCCCCC`). Esto logra ratios de contraste ≥7:1 con fondo oscuro.
- **Acentos:** Color de la marca (p.ej. azul `#2774AE`) para botones y enlaces. Asegurar contraste con fondos. Por ejemplo, azul brillante sobre gris oscuro supera 4.5:1.
- **Colores de estado:** Usar rojos intensos para errores (`#FF3B30`), verdes vibrantes para éxito, naranjas para advertencias, todos con suficiente contraste sobre fondo oscuro.
- **Tema claro opcional:** Implementar `prefers-color-scheme` para soportar modo claro si el usuario lo prefiere. En modo claro, usar fondo claro (`#FAFAFA` en lugar de blanco puro) y texto oscuro (`#202124` o similar), manteniendo contrastes altos.
- **Preferencia del usuario:** Respetar la elección de esquema de color. No forzar modo oscuro si el usuario prefiere claro. Dark mode puede activarse por defecto, pero siempre dejar opción (botón toggler o automática por sistema).
- **Iconos e imágenes:** Usar íconos SVG o font icons (e.g. FontAwesome) con color `currentColor` para adaptarse al tema. Diseñar variantes de íconos si es necesario (por ejemplo, iconos con bordes sutiles en modo oscuro para destacar).
- **Paleta de ejemplo (CSS variables):** 
  ```css
  :root {
    --color-bg: #121212;
    --color-surface: #1E1E1E;
    --color-text: #FFFFFF;
    --color-text-secondary: #CCCCCC;
    --color-accent: #2774AE;
    --color-error: #FF3B30;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --color-bg: #FAFAFA;
      --color-surface: #FFFFFF;
      --color-text: #202124;
      --color-text-secondary: #444444;
      --color-accent: #0057D9;
      --color-error: #D32F2F;
    }
  }
  ```

*Nota:* Un tema oscuro **no es automáticamente accesible**; se deben respetar contrastes y legibilidad en ambos esquemas.

## Rendimiento y Core Web Vitals

Aunque el enfoque principal es visual, cuidar el rendimiento mejora la UX móvil:

- **LCP (Largest Contentful Paint):** Apuntar a < 2.5s al cargar la página principal. Por ejemplo, optimizar imágenes grandes (resizing, compresión) y cargar componentes críticos primero.
- **INP (Interaction to Next Paint):** Buscar < 200 ms para acciones interactivas. Reducir JS innecesario, evitar bloqueos de hilo principal.
- **CLS (Cumulative Layout Shift):** Mantener < 0.1 para evitar saltos de diseño. Dar dimensiones a imágenes y ads, no inyectar contenido encima.
- **Optimización de assets:** Habilitar compresión (Gzip/Brotli), minificar CSS/JS (Vite lo hace). Cargar scripts con `defer`. Lazy-load módulos Vue con `defineAsyncComponent` o route-based lazy loading.
- **Auditoría:** Usar Lighthouse (modo móvil) y herramientas de Google (Search Console, PageSpeed Insights) para detectar problemas de experiencia web. Además, verificar test de usabilidad móvil (p.ej. Google Mobile-Friendly test).
- **SSL y seguridad:** Mantener HTTPS. Google considera la experiencia global (HTTPS, sin pop-ups intrusivos) para el ranking.

## Herramientas y pruebas

- **Medición:** Chrome DevTools (modo dispositivo, Throttling de CPU/red), Lighthouse, PageSpeed Insights. Extensiones como **axe DevTools** o **WAVE** para accesibilidad.
- **Pruebas en dispositivos reales:** Validar en varios móviles (iOS y Android) y navegadores (Chrome, Safari, Firefox). Simular pantallas pequeñas/medianas/grandes.
- **Screen readers:** Probar con NVDA (Windows) y VoiceOver (macOS) la navegabilidad. Verificar que el flujo de lectura sea lógico.
- **Tab order y foco:** Navegar toda la app con teclado (Tab/Shift+Tab). Todo elemento interactivo debe tener foco visible y acceder al componente correcto.
- **Contrast checker:** Usar herramientas para confirmar ratios (p.ej. Contrast Checker de WebAIM).
- **Testing visual:** Asegurarse de que no haya traslapes ni textos cortados en tamaños de pantalla medios.
- **Pruebas de regresión:** Configurar tests automatizados de interfaz si es posible (p.ej. Cypress con auditorías de accesibilidad).

## Plan incremental de migración

1. **Configuración inicial:** Verificar meta viewport en todas las páginas (☑️ incluir si falta).
2. **Layout móvil base:** Adaptar el HTML/CSS para que en <600px todo se muestre en una sola columna vertical sin overflow.
3. **Navegación:** Implementar menú hamburguesa para móvil. Asegurar teclado y etiquetado ARIA.
4. **Textos y botones:** Ajustar tamaños mínimos de fuente (≥16px). Incrementar padding alrededor de botones e inputs para cumplir 44px si es posible.
5. **Imágenes:** Convertir imágenes grandes a fluidas (`max-width:100%`). Agregar atributos `srcset` para distintas resoluciones.
6. **Breakpoints:** Introducir media queries para >600px (tablets) y >900px (desktop), ajustando columnas y disposición.
7. **Accesibilidad:** Revisar contrastes, enfoque, roles. Corregir errores de WCAG con linters/axe.
8. **Tema oscuro:** Implementar estilos oscuros según variables definidas. Revisar legibilidad en ambos esquemas con herramientas de contraste.
9. **Iterar y revisar:** Probar cada cambio en móvil real. Ajustar basándose en feedback y auditorías.
10. **Revisión de equipo:** Antes de merge final, compartir los cambios de UI/UX con el equipo para validar que no se alteran funcionalidades.

## Checklist de aceptación

- **Adaptabilidad:** La interfaz no debe presentar scroll horizontal ni elementos ocultos en ningún breakpoint (SC 1.4.10).
- **Contraste:** Todos los textos y botones cumplen ratio ≥4.5:1 (preferible 7:1 para texto pequeño).
- **Tamaños táctiles:** Todos los controles táctiles ≥24px. Botones grandes y espacios correctamente distribuidos (fat-finger friendly).
- **Funcionalidad:** Toda funcionalidad original opera igual que antes (login, roles, permisos). No se han introducido cambios en endpoints, seguridad o lógica.
- **Accesibilidad:** La navegación por teclado funciona, skip-nav presente, etiquetas ARIA correctas. Pruebas con screen readers sin errores críticos.
- **Rendimiento:** Core Web Vitals dentro de rangos recomendados. No hay regressions significativas en carga/interactividad.
- **Consistencia visual:** El diseño es moderno y limpio, siguiendo la identidad de marca. El modo oscuro es coherente y no produce problemas visuales.
- **Pruebas:** Auditoría Lighthouse móvil/pass, reporte de accesibilidad (axe) con pocos problemas (error corregido o justificado).

Para cada cambio implementado se deben documentar los criterios de diseño o accesibilidad relevantes usados. Las referencias incluidas se basan en estándares W3C/WAI y guías oficiales (WCAG 2.2, WAI-ARIA Authoring Practices, MDN, Google Developers, Apple HIG). 

[Descargar documento .md](sandbox:/mnt/data/SmartLearn_responsive_design.md)