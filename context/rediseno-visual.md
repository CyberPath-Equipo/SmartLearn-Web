# Sistema visual de SmartLearn Web

## Alcance y composición

Modernización de la presentación de SmartLearn Web para docentes y administración, conforme al documento de incorporación del proyecto. La aplicación Android está orientada principalmente a estudiantes. Se aplicaron criterios de Impeccable y Emil Kowalski para jerarquía, legibilidad y respuesta visual breve.

La capa común reside en `vue-frontend/src/assets/styles/visual-system.css` y se carga desde `App.vue`. Emplea selectores bajo `#app` para unificar los componentes existentes. En `SmartlearnView.vue`, el bloque principal precede al carrusel y los beneficios utilizan una lista HTML válida. La composición reutiliza imágenes y logos existentes.

La comparación con `42a9370` conserva textos, scripts, directivas, eventos, enlaces, rutas, integración Vue y contratos de API. Los paquetes mantienen sus versiones.

## Tokens y criterios

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#087f9f` | Acentos y bordes interactivos |
| `--secondary` | `#254ca8` | Cabeceras y acciones principales |
| `--accent` | `#005fcc` | Foco, enlaces y selección de controles |
| `--text` / `--sl-ink` | `#203449` / `#163451` | Cuerpo y títulos |
| `--sl-muted` | `#526579` | Información secundaria |
| `--light-bg` / `--card-bg` | `#f5f8fb` / `#fff` | Fondo y superficies |
| `--sl-line` | `#d7e2ec` | Separadores y bordes |
| `--sl-wash` / `--sl-blue-wash` | `#eaf5f8` / `#edf3fc` | Bloques destacados y navegación activa |
| `--sl-cyan` | `#07acda` | Token de cian disponible |
| `--radius` | `14px` | Radio base |
| `--sl-ease` | `cubic-bezier(.22, 1, .36, 1)` | Curva de transición |
| `--transition` | `160ms var(--sl-ease)` | Duración base |

La tipografía utiliza Segoe UI y fuentes del sistema. El cuerpo tiene interlineado de 1.65, los títulos de 1.2 y las áreas de lectura de hasta 1.85. Los contenedores principales llegan a 1240 px y el contenido habitual a 1176 px. La composición favorece superficies claras, bordes finos, espacios de 12 a 64 px y radios de 8 a 16 px. Los campos tienen una altura mínima de 48 px y los botones de 44 px. El foco visible usa un contorno azul de 3 px.

## Cobertura y adaptación

El CSS compartido cubre cabeceras, navegación y pie, inicio público, autenticación y verificación, aviso de privacidad, presentación del producto móvil, paneles académicos, materias, temas, subtemas, ejercicios, preguntas, teoría, perfil, formularios, gráficas, estados y modales mediante sus clases actuales.

A 900 px se apilan las áreas del dashboard, se reducen márgenes y el carrusel y las capturas móviles pasan a dos columnas. A 600 px se compactan tarjetas y formularios, la navegación pública utiliza dos columnas, las capturas y tarjetas del carrusel pasan a una columna y la imagen del bloque principal se coloca debajo del texto. Los modales limitan su altura con `100dvh` y permiten desplazamiento interno. Las reglas de ajuste de texto y anchos mínimos atienden contenido largo.

## Movimiento

Los controles usan transiciones de 160 ms y las tarjetas y modales de 180 ms. Con puntero fino, las tarjetas interactivas se elevan 2 px y los botones presionados escalan a 0.98. Las superficies de lectura permanecen estáticas. `prefers-reduced-motion` desactiva animaciones, transiciones y desplazamiento suave de CSS. El carrusel conserva su auto-scroll JavaScript original, que solicita `smooth`, por lo que la cobertura de movimiento reducido requiere revisión adicional de ese comportamiento.

## Verificación y límites

Comprobaciones reportadas durante esta intervención:

- `npm run build` finalizó correctamente.
- La comparación AST de los 27 archivos Vue verificó la conservación de scripts, directivas, eventos, textos y atributos de enlaces. Los JavaScript de `src` coinciden al normalizar CRLF.
- El detector ejecutado devolvió `[]`, sin hallazgos.
- Node 22.15 produjo avisos de engines porque Babel requiere 22.18 o superior. `npm ci` reportó nueve vulnerabilidades de severidad alta. El build mantuvo el aviso preexistente de chunks superiores a 500 kB.

Computer Use se detuvo al impedirse verificar la URL en Windows. Quedan pendientes capturas y revisión visual manual responsive. Las vistas autenticadas se examinaron estáticamente, sin sesión. Estas comprobaciones tienen alcance técnico y documental. La conformidad WCAG requiere una evaluación específica.

## Revisión del equipo antes de integrar

1. Ejecutar el frontend según `vue-frontend/README.md` y recorrer las vistas públicas y autenticadas con una sesión autorizada.
2. Revisar escritorio, tablet y móvil, incluyendo anchos próximos a 900 y 600 px, contenido largo y zoom del navegador.
3. Comprobar navegación por teclado, foco visible, contraste, formularios, errores, cargas, estados vacíos, modales, gráficas y carrusel.
4. Activar movimiento reducido y observar también el auto-scroll del carrusel.
5. Confirmar las acciones y rutas habituales, revisar consola y red, y registrar capturas de las vistas revisadas.
