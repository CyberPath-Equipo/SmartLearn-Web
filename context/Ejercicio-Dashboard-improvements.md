# Plan de Implementación - Dashboard de Ejercicio (SmartLearn)

## Objetivo

Proporcionar al docente métricas claras sobre el comportamiento de los estudiantes en un ejercicio específico, permitiendo identificar dificultades, tiempos de resolución y posibles problemas pedagógicos.

La implementación debe utilizar exclusivamente los datos disponibles actualmente en la base de datos y en los endpoints existentes.

---

# Arquitectura General

## Fuente de datos

Se utilizará únicamente:

```http
GET /intento-ejercicio
```

---

## DTO utilizado

```java
public class IntentoEjercicioDto {
    private Integer id;
    private Double puntaje;
    private Integer duracionSeg;
    private String fecha;
    private String estado;

    private Integer idUsuario;
    private Integer idEjercicio;
}
```

---

## Filtrado

Una vez obtenidos todos los intentos:

```javascript
const intentosEjercicio =
    intentos.filter(
        i => String(i.idEjercicio) === String(props.idEjercicio)
    );
```

Todos los cálculos posteriores se realizarán únicamente sobre este conjunto filtrado.

---

# Dashboard C1 - Tiempo Promedio vs Puntaje Promedio

## Objetivo

Mostrar el comportamiento promedio de los alumnos en el ejercicio.

Este dashboard sustituye completamente la propuesta inicial basada en un Scatter Plot de intentos individuales.

---

## Justificación

El Scatter Plot muestra información demasiado granular.

El docente debe interpretar manualmente cada punto para identificar tendencias.

En cambio, los promedios permiten obtener conclusiones inmediatas.

---

## Tipo de gráfica

```text
Bar Chart
```

---

## Métricas

### Tiempo Promedio

Fórmula:

```text
Σ duración de intentos
----------------------
Cantidad de intentos
```

Implementación:

```javascript
const tiempoPromedio =
    intentosEjercicio.reduce(
        (acc, i) => acc + (i.duracionSeg || 0),
        0
    ) / intentosEjercicio.length;
```

---

### Puntaje Promedio

Fórmula:

```text
Σ puntajes obtenidos
--------------------
Cantidad de intentos
```

Implementación:

```javascript
const puntajePromedio =
    intentosEjercicio.reduce(
        (acc, i) => acc + (i.puntaje || 0),
        0
    ) / intentosEjercicio.length;
```

---

## Visualización

La gráfica tendrá dos barras:

```text
Tiempo Promedio (Segundos)
Puntaje Promedio (%)
```

Ejemplo:

```text
Tiempo Promedio     145
Puntaje Promedio     72
```

---

## Interpretación

### Tiempo alto + puntaje alto

```text
Ejercicio difícil pero alcanzable.
```

---

### Tiempo alto + puntaje bajo

```text
Ejercicio problemático.
Posible dificultad excesiva.
```

---

### Tiempo bajo + puntaje alto

```text
Ejercicio sencillo.
```

---

### Tiempo bajo + puntaje bajo

```text
Posible abandono o falta de comprensión.
```

---

# Dashboard C2 - Estado de Intentos

## Objetivo

Determinar cuántos estudiantes completan exitosamente el ejercicio y cuántos lo abandonan.

---

## Tipo de gráfica

```text
Donut Chart
```

---

## Datos requeridos

Campo:

```java
estado
```

del DTO:

```java
IntentoEjercicioDto
```

---

## Métricas

### Intentos completados

```javascript
const completados =
    intentosEjercicio.filter(
        i => i.estado?.toUpperCase() === 'COMPLETADO'
    ).length;
```

---

### Intentos abandonados

```javascript
const abandonados =
    intentosEjercicio.filter(
        i => i.estado?.toUpperCase() === 'ABANDONADO'
    ).length;
```

---

## Visualización

```text
Completados
Abandonados
```

Ejemplo:

```text
Completados 85%
Abandonados 15%
```

---

## Interpretación

### Alta tasa de completados

```text
El ejercicio es accesible para los estudiantes.
```

---

### Alta tasa de abandonos

```text
El ejercicio puede requerir revisión.
```

---

# Validaciones

## Evitar registros incompletos

No deben considerarse intentos con datos nulos.

```javascript
const intentosValidos =
    intentosEjercicio.filter(
        i =>
            i.duracionSeg != null &&
            i.puntaje != null
    );
```

---

## Cantidad mínima de datos

Si existen menos de tres intentos válidos:

```javascript
if(intentosValidos.length < 3){
    noData.value = true;
}
```

Mostrar:

```text
Datos insuficientes o inexistentes.
```

---

# Endpoints Utilizados

| Endpoint               | Uso                                         |
| ---------------------- | ------------------------------------------- |
| GET /intento-ejercicio | Obtención de todos los intentos del sistema |

---

# Resultado Final

## Dashboard C1

### Tiempo Promedio vs Puntaje Promedio

* Tipo: Barra
* Objetivo: Medir dificultad y desempeño general.

---

## Dashboard C2

### Completados vs Abandonados

* Tipo: Donut
* Objetivo: Medir nivel de finalización del ejercicio.

---

# Beneficios

* No requiere modificaciones al backend.
* Utiliza datos ya existentes.
* Implementación sencilla.
* Compatible con ApexCharts.
* Fácil de justificar académicamente.
* Información directamente útil para docentes.
* Escalable para futuras métricas avanzadas.
