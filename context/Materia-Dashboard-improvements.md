# Plan de Implementación - Dashboard de Materia (SmartLearn)

## Objetivo

Implementar el módulo de analítica específico de una materia utilizando únicamente los endpoints actualmente disponibles en el backend, evitando modificaciones al servidor y realizando todos los cálculos estadísticos en el frontend mediante Vue y ApexCharts.

---

# Arquitectura General

## Fuente de datos

Todos los dashboards utilizarán endpoints generales:

```http
GET /tema
GET /subtema
GET /ejercicio
GET /intento-ejercicio
GET /teoria
```

Posteriormente se realizará filtrado por:

```text
Materia
 → Tema
 → Subtema
 → Ejercicio
 → Intento
```

dentro del frontend.

---

# Dashboard B1 - Ejercicios Problemáticos

## Objetivo

Identificar ejercicios donde los estudiantes presentan mayores dificultades.

---

## Tipo de gráfica

```text
Barra horizontal
```

---

## Datos requeridos

### Endpoints

```http
GET /ejercicio
GET /intento-ejercicio
GET /tema
GET /subtema
```

---

## Relación de datos

```text
Materia
 → Temas
 → Subtemas
 → Ejercicios
 → Intentos
```

---

## Regla de negocio

Se considerará error cuando:

```java
puntaje < 70
```

o

```java
estado == "ABANDONADO"
```

---

## Cálculo

Para cada ejercicio:

```text
tasaError =
errores / intentos * 100
```

---

## Fórmula

```javascript
const tasaError =
(ejercicio.errores / ejercicio.intentos) * 100;
```

---

## Resultado esperado

Mostrar los 5 ejercicios con mayor tasa de error.

---

## Interacción futura

Al seleccionar una barra:

```text
Ir al ejercicio correspondiente
```

mediante:

```javascript
router.push(...)
```

---

# Dashboard B2 - Actividad por Tema

## Objetivo

Determinar qué temas generan mayor actividad de los estudiantes.

---

## Tipo de gráfica

```text
Barra vertical
```

---

## Datos requeridos

### Endpoints

```http
GET /tema
GET /subtema
GET /ejercicio
GET /intento-ejercicio
```

---

## Relación de datos

```text
Tema
 → Subtema
 → Ejercicio
 → Intento
```

---

## Métrica

```text
Cantidad de intentos realizados
```

---

## Cálculo

Para cada intento:

```text
Intento
 → Ejercicio
 → Subtema
 → Tema
```

Incrementar contador.

---

## Resultado esperado

Mostrar los 5 temas con mayor actividad.

---

## Interpretación

Mayor actividad puede indicar:

* Temas populares.
* Temas difíciles.
* Temas más utilizados por los docentes.

---

# Dashboard B3 - Distribución de Recursos de la Materia

## Sustitución

Reemplaza completamente:

```text
Avance Global
(Progreso promedio)
```

---

## Motivo

Actualmente no existe:

```http
GET /progreso-subtema
```

ni un endpoint equivalente que permita obtener el progreso masivo de los estudiantes.

Por lo tanto el cálculo no es viable.

---

# Nuevo objetivo

Mostrar el volumen de contenido existente en la materia.

---

## Tipo de gráfica

```text
Barra vertical
```

o

```text
Donut Chart
```

(Barra vertical recomendada)

---

## Datos requeridos

### Endpoints

```http
GET /tema
GET /subtema
GET /ejercicio
GET /teoria
```

---

## Métricas

Para la materia actual:

* Temas
* Subtemas
* Ejercicios
* Teorías

---

## Cálculos

### Total de temas

```javascript
temasMateria.length
```

---

### Total de subtemas

```javascript
subtemasMateria.length
```

---

### Total de ejercicios

```javascript
ejerciciosMateria.length
```

---

### Total de teorías

Filtrar teorías cuyos:

```text
idSubtema
```

pertenezcan a la materia.

---

## Resultado esperado

Ejemplo:

```text
Temas       8
Subtemas    14
Teorías     22
Ejercicios  35
```

---

# Optimizaciones Futuras (No incluir en esta iteración)

Actualmente los dashboards utilizan endpoints globales:

```http
GET /tema
GET /subtema
GET /ejercicio
GET /intento-ejercicio
```

porque permiten completar el módulo sin modificar el backend.

Posteriormente pueden incorporarse endpoints derivados:

```http
GET /materia/{id}/temas
GET /tema/{id}/subtemas
GET /subtema/{id}/ejercicios
GET /materia/{id}/estadisticas
```

con el objetivo de:

* Reducir tráfico.
* Reducir memoria en frontend.
* Mejorar tiempos de carga.
* Simplificar cálculos.

---

# Resultado Final del Dashboard de Materia

| Dashboard                   | Estado   |
| --------------------------- | -------- |
| B1 Ejercicios Problemáticos | Mantener |
| B2 Actividad por Tema       | Mantener |
| B3 Avance Global            | Eliminar |
| B3 Distribución de Recursos | Nuevo    |

---

# Beneficios

* No requiere cambios en Spring Boot.
* Compatible con los DTO actuales.
* Compatible con la base de datos actual.
* Implementable dentro del plazo restante.
* Fácil de justificar en la documentación académica.
* Escalable para futuras optimizaciones mediante endpoints especializados.