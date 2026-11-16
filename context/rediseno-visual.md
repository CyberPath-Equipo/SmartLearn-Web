# Sistema visual de SmartLearn Web

## Alcance y composición

Modernización de la presentación de SmartLearn Web para docentes y administración, conforme al documento de incorporación del proyecto. La aplicación Android está orientada principalmente a estudiantes. Se aplicaron criterios de Impeccable y Emil Kowalski para jerarquía, legibilidad y respuesta visual breve.

La capa común reside en `vue-frontend/src/assets/styles/visual-system.css` y se carga desde `App.vue`. Emplea selectores bajo `#app` para unificar los componentes existentes. El inicio dispone el título y la fotografía en dos columnas, seguido del carrusel y bloques informativos con fondos suaves. La cabecera pública combina una superficie blanca con el logo original sobre azul. La autenticación incorpora un panel lateral con el logo existente. Los beneficios utilizan una lista HTML válida.

La iteración conserva los textos existentes, enlaces, rutas y contratos de API. `NavBarPrincipal.vue` incorpora el estado presentacional autorizado del menú hamburguesa, su apertura, cierre y gestión de teclado y foco. Los scripts restantes y los JavaScript de `src` conservan su contenido. Los paquetes mantienen sus versiones.

## Tokens y criterios

| Token | Valor | Uso |
|---|---|---|
| `--primary` / `--sl-cyan` | `#07acda` | Cian original, acentos y bordes interactivos |
| `--secondary` | `#254ca8` | Cabeceras y acciones principales |
| `--accent` | `#005fcc` | Foco, enlaces y selección de controles |
| `--text` / `--sl-ink` | `#253c56` / `#172f50` | Cuerpo y títulos |
| `--sl-muted` | `#53657d` | Información secundaria |
| `--light-bg` / `--card-bg` | `#f8fafc` / `#fff` | Fondo y superficies |
| `--sl-line` | `#dce5ef` | Separadores y bordes |
| `--sl-wash` / `--sl-blue-wash` | `#eaf8fc` / `#edf1fc` | Bloques destacados y navegación activa |
| `--sl-sand` / `--sl-teal-wash` | `#faf4e9` / `#e9f5f0` | Fondos complementarios arena y verde suave |
| `--radius` | `14px` | Radio base |
| `--sl-ease` | `cubic-bezier(.22, 1, .36, 1)` | Curva de transición |
| `--transition` | `160ms var(--sl-ease)` | Duración base |

La paleta conserva el azul original `#254CA8` y el cian `#07ACDA`. La tipografía usa DM Sans variable local, descargada de `@fontsource-variable/dm-sans`, con Segoe UI y sans-serif como respaldo. El archivo WOFF2 y su `LICENSE` residen en `vue-frontend/public/fonts`. Los iconos lineales proceden del sprite local `vue-frontend/public/smartlearn-icons.svg`, creado en esta sesión.

El cuerpo tiene interlineado de 1.65, los títulos de 1.2 y las áreas de lectura de hasta 1.85. El título principal usa 1.04. Los contenedores principales llegan a 1240 px y el contenido habitual a 1176 px. Las superficies usan bordes finos y radios de 8 a 16 px. Los campos tienen una altura mínima de 48 px y los botones de 44 px. El foco visible usa un contorno azul de 3 px.

## Cobertura y adaptación

El CSS compartido cubre cabeceras, navegación y pie, inicio público, autenticación y verificación, aviso de privacidad, presentación del producto móvil, paneles académicos, materias, temas, subtemas, ejercicios, preguntas, teoría, perfil, formularios, gráficas, estados y modales mediante sus clases actuales.

A 1100 px aparece el botón hamburguesa de 48 px y la navegación pública pasa a un desplegable vertical con altura limitada. Expone `aria-expanded` y `aria-controls`, cierra al seleccionar un enlace o sacar el foco de la cabecera, y Escape devuelve el foco al botón. A 900 px se apilan las áreas del dashboard, se reducen márgenes, el carrusel muestra tres tarjetas y las capturas móviles usan dos columnas. A 600 px el inicio y las capturas pasan a una columna, el carrusel muestra una tarjeta y la autenticación presenta el formulario en una sola área. Los modales limitan su altura con `100dvh` y permiten desplazamiento interno.

## Movimiento

Los criterios de movimiento siguen las skills de Emil disponibles en `.agents/skills`. Los controles usan transiciones de 160 ms y las tarjetas y modales de 180 ms. El menú abre en 200 ms y cierra en 140 ms mediante opacidad y transformación, con transiciones desactivadas al usar teclado. Con puntero fino, las tarjetas interactivas se elevan 2 px y los botones presionados escalan a 0.98. `prefers-reduced-motion` desactiva animaciones, transiciones y desplazamiento suave de CSS. El carrusel conserva su auto-scroll JavaScript original, que solicita `smooth`, por lo que ese comportamiento requiere revisión adicional con movimiento reducido.

## Verificación y límites

Comprobaciones reportadas durante esta intervención:

- `npm run build` finalizó correctamente.
- La comparación AST verificó la conservación de textos y enlaces. Los scripts restantes conservan su contenido, con la incorporación presentacional del menú en `NavBarPrincipal.vue` descrita arriba. Los JavaScript de `src` coinciden al normalizar CRLF.
- El detector ejecutado devolvió `[]`, sin hallazgos.
- La comprobación HTTP en `localhost:5173` confirmó el CSS actualizado y respuesta 200 del sprite.
- Node 22.15 produjo avisos de engines porque Babel requiere 22.18 o superior. `npm ci` reportó nueve vulnerabilidades de severidad alta. El build mantuvo el aviso preexistente de chunks superiores a 500 kB.

La revisión de navegador volvió a detenerse al impedirse verificar la URL en Windows. Quedan pendientes capturas y revisión visual manual responsive. Las vistas autenticadas se examinaron estáticamente, sin sesión. Estas comprobaciones tienen alcance técnico y documental. La conformidad WCAG requiere una evaluación específica.

## Revisión del equipo antes de integrar

1. Ejecutar el frontend según `vue-frontend/README.md` y recorrer las vistas públicas y autenticadas con una sesión autorizada.
2. Revisar escritorio, tablet y móvil, incluyendo anchos próximos a 1100, 900 y 600 px, contenido largo y zoom del navegador.
3. Comprobar menú abierto y cerrado, Escape, recorrido por teclado, foco visible, contraste, formularios, errores, cargas, estados vacíos, modales, gráficas y carrusel.
4. Activar movimiento reducido y observar también el auto-scroll del carrusel.
5. Confirmar las acciones y rutas habituales, revisar consola y red, y registrar capturas de las vistas revisadas.
