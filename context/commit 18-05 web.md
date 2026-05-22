# SmartLearn Web - Estado General del Proyecto
## Fecha de actualización
Mayo 2026

---

# 1. Descripción General del Proyecto

SmartLearn es una plataforma educativa multiplataforma enfocada en el aprendizaje modular mediante teoría, ejercicios prácticos y seguimiento académico.

Actualmente el ecosistema se divide en:

- Aplicación móvil Android
- Backend REST API con Spring Boot
- Plataforma Web administrativa/académica
- Futuro módulo de estadísticas y analítica

El objetivo principal del sistema es permitir:

- Gestión académica modular
- Creación de contenido educativo estructurado
- Resolución de ejercicios
- Seguimiento del progreso estudiantil
- Obtención de métricas académicas y analíticas

---

# 2. Estado Actual del Proyecto Web

## Estado General

La plataforma web ya cuenta con:

- CRUD completo de contenido académico
- Navegación funcional
- Integración con backend REST
- Formularios dinámicos
- Manejo de teoría, ejercicios y preguntas
- Gestión visual moderna con Vue

Actualmente el sistema web ya alcanzó el mismo nivel funcional que la versión estática previa.

---

# 3. Arquitectura Tecnológica

## Frontend Web

Tecnologías utilizadas:

- Vue 3
- Composition API
- Vue Router
- Axios
- CSS Scoped
- SPA (Single Page Application)

Estructura general:

```txt
src/
 ├── api/
 ├── components/
 ├── router/
 ├── views/
 ├── assets/
 └── App.vue
```

---

## Backend

Tecnologías:

- Spring Boot
- Spring Web
- JPA / Hibernate
- MySQL
- API REST

Responsabilidades:

- Persistencia de datos
- Lógica académica
- Relaciones entre entidades
- Seguridad futura
- Analítica futura

---

# 4. Modelo Académico Actual

La estructura académica actual es:

```txt
Materia
 └── Tema
      └── Subtema
           └── Teoría
                └── Ejercicios
                     └── Preguntas
                          └── Opciones
```

---

# 5. Estado del CRUD Académico

## COMPLETADO AL 100%

Actualmente funcionan correctamente:

---

## Materias

- Crear materia
- Editar materia
- Consultar materia
- Eliminar materia

---

## Temas

- Crear tema
- Editar tema
- Consultar tema
- Eliminar tema

---

## Subtemas

- Crear subtema
- Editar subtema
- Consultar subtema
- Eliminar subtema

---

## Teoría

### Funcionalidades terminadas

- Consultar teoría
- Crear teoría
- Editar teoría
- Eliminar teoría
- Navegación automática
- Renderizado de párrafos
- Manejo de estados visuales

### Estados implementados

```txt
consultando
crear
ver
editar
```

### Flujo actual

- Si el subtema NO tiene teoría:
  - Se muestra formulario de creación

- Si el subtema YA tiene teoría:
  - Se muestra la teoría
  - Se habilitan acciones CRUD

---

## Ejercicios

### Funcionalidades terminadas

- Crear ejercicio
- Editar ejercicio
- Consultar ejercicio
- Eliminar ejercicio

### Estado actual

El sistema ya soporta:

- Ejercicios completos
- Preguntas dinámicas
- Opciones dinámicas
- Selección de respuesta correcta
- Persistencia REST

---

# 6. Corrección del Error Crítico de Formularios

## Problema presentado

Durante el desarrollo ocurrió un error importante donde:

- Los campos input no mostraban texto
- Los placeholders desaparecían
- No era posible escribir opciones
- Algunos elementos parecían invisibles

Esto provocó que aparentemente:

- El CRUD dejara de funcionar
- No se pudieran crear teorías
- No se pudieran escribir respuestas

---

## Causa real detectada

El problema NO provenía del backend.

El origen estaba en:

- CSS Flexbox
- Distribución incorrecta de width
- Conflictos entre flex y width
- Inputs sin espacio renderizable

Particularmente:

```css
display: flex;
```

junto con:

```css
width: 100%;
```

y ciertos layouts provocaban colapso visual de los inputs.

---

## Solución implementada

Se corrigió:

```css
.opcion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.opcion-item input[type="radio"] {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.opcion-input {
  flex: 1;
  min-width: 0;
}
```

---

## Resultado

Actualmente:

- Los inputs funcionan correctamente
- Los placeholders se renderizan
- El texto ingresado se muestra
- Los radios están alineados
- El formulario es completamente funcional

---

# 7. Estado del Sistema de Ejercicios

## Implementación actual

Ya existe:

### Crear ejercicio completo

Incluye:

- Nombre del ejercicio
- Pregunta inicial
- Opciones dinámicas
- Respuesta correcta
- Persistencia automática

---

## Flujo implementado

### Paso 1

Crear ejercicio:

```http
POST /ejercicio
```

---

### Paso 2

Crear pregunta:

```http
POST /pregunta
```

---

### Paso 3

Crear opciones:

```http
POST /opcion
```

---

# 8. Estado Visual del Proyecto

## Diseño actual

El sistema web ya cuenta con:

- Tarjetas modernas
- Formularios estilizados
- Botones consistentes
- Layout responsivo parcial
- Jerarquía visual clara
- Navegación SPA

---

## Pendientes visuales

Aún faltan:

- Responsive completo móvil
- Sistema global de temas
- Dark mode
- Componentización avanzada
- Animaciones
- Sistema global de notificaciones

---

# 9. Estado de Integración Frontend-Backend

## Integración funcional

La comunicación actual se realiza mediante:

```txt
Vue -> Axios -> Spring Boot API
```

---

## Endpoints ya utilizados

### Teoría

```http
GET    /subtema/{idSubtema}/teoria
POST   /teoria
PUT    /teoria/{id}
DELETE /subtema/teoria/{id}
```

---

### Ejercicios

```http
GET    /subtema/{idSubtema}/ejercicios
POST   /ejercicio
DELETE /ejercicio/{id}
```

---

### Preguntas

```http
POST /pregunta
```

---

### Opciones

```http
POST /opcion
```

---

# 10. Módulo de Estadísticas (Próxima Implementación)

## Objetivo

Implementar sistema completo de:

- Analítica educativa
- Métricas académicas
- Seguimiento estudiantil
- Visualización de progreso

---

# 11. Métricas Planeadas

## Progreso académico

- % subtemas completados
- % teoría leída
- avance por materia

---

## Rendimiento

- tasa de aciertos
- promedio por ejercicio
- intentos realizados
- precisión académica

---

## Tiempo

- tiempo por ejercicio
- tiempo por sesión
- tiempo activo diario

---

## Frecuencia

- sesiones por día
- actividad semanal
- recurrencia de estudio

---

## Velocidad de avance

- subtemas completados por semana
- ritmo de aprendizaje

---

# 12. Consideraciones Importantes para Nuevos Desarrolladores

## El frontend actual YA NO es estático

Anteriormente:

- HTML estático
- Manipulación manual
- JavaScript tradicional

Actualmente:

- Vue reactivo
- Composition API
- Estados dinámicos
- Router SPA

---

## NO modificar estructura REST existente sin coordinación

Muchos componentes dependen de:

```txt
idSubtema
idEjercicio
idPregunta
```

y relaciones jerárquicas ya establecidas.

---

## Los formularios dinámicos ya funcionan

NO reestructurar:

- sistema de opciones
- radios
- flexbox principal

sin revisar cuidadosamente CSS.

---

# 13. Problemas Técnicos Ya Resueltos

## Resueltos

- Inputs invisibles
- Placeholders ocultos
- Radios desalineados
- Width colapsado
- Formularios inutilizables
- CRUD parcial
- Estados inconsistentes

---

# 14. Estado General Final

## Situación actual

La plataforma web ya alcanzó:

### Backend

- funcional
- persistente
- integrado

### Frontend

- dinámico
- moderno
- CRUD completo

### Contenido académico

- completamente administrable

---

# 15. Próximos Objetivos

## Corto plazo

- módulo estadístico
- dashboards
- gráficas
- métricas

---

## Mediano plazo

- autenticación robusta
- roles avanzados
- analítica predictiva
- seguimiento inteligente

---

## Largo plazo

- IA educativa
- recomendaciones automáticas
- aprendizaje adaptativo
- sincronización multiplataforma

---

# 16. Estado de Estabilidad

## Estado actual del proyecto

```txt
ESTABLE PARA CONTINUAR DESARROLLO
```

El CRUD académico principal ya se considera funcional y operativo.