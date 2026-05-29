# SmartLearn - Plan de Implementación del Módulo de Análisis de Datos

---

# 1. Objetivo General

Implementar un módulo funcional de análisis de datos y dashboards para SmartLearn en un periodo de una semana, utilizando la arquitectura actual del proyecto y minimizando riesgos técnicos, sobrecarga de desarrollo y cambios estructurales innecesarios.

El objetivo principal NO es construir una plataforma avanzada de Business Intelligence, sino una primera fase estable y escalable de analítica educativa integrada al ecosistema actual.

---

# 2. Restricciones Reales del Proyecto

## Restricciones técnicas

* Backend ya existente en Spring Boot
* Frontend ya existente en Vue 3
* Base de datos MySQL ya estructurada
* Android aún en desarrollo
* Persisten problemas menores de Hibernate/JPA
* Tiempo total de implementación: 1 semana
* Equipo pequeño:

  * 1 backend principal
  * 2 desarrolladores frontend

---

## Decisión Arquitectónica Importante

NO se implementarán:

* Sistemas ETL reales
* Microservicios analíticos
* Integración directa R ↔ Backend
* Machine Learning
* IA predictiva
* Sistemas de eventos complejos
* Auditoría avanzada
* Dashboards extremadamente dinámicos

---

## Tecnologías aprobadas para el módulo

### Backend

* Java
* Spring Boot
* Spring Data JPA
* JPQL
* DTO Projections

### Frontend

* Vue 3
* Composition API
* Axios

### Dashboards

* ApexCharts

### Base de datos

* MySQL
---

# 3. Objetivos Funcionales del Módulo

El módulo debe permitir:

* Visualizar estadísticas generales
* Visualizar estadísticas por materia
* Visualizar estadísticas por ejercicio
* Detectar ejercicios problemáticos
* Mostrar actividad académica
* Mostrar progreso estudiantil
* Mostrar actividad general del sistema

---

# 4. Decisión Estratégica de Implementación

## IMPORTANTE

Las estadísticas NO se almacenarán en tablas nuevas.

Todas las métricas se calcularán dinámicamente mediante:

* Queries agregadas
* COUNT
* AVG
* SUM
* GROUP BY

---

## Motivo

Esto:

* reduce complejidad
* evita inconsistencias
* reduce tiempo de desarrollo
* aprovecha completamente la arquitectura actual

---

# 5. Librería de Dashboards

## Librería oficial seleccionada

ApexCharts

---

## Motivos

* Excelente integración Vue 3
* Baja complejidad
* Buen rendimiento
* Compatible con gráficas:

  * barra
  * línea
  * doughnut
  * scatter
  * bubble

---

# 6. Estructura Backend Recomendada

## Integración sobre la arquitectura existente

El módulo de estadísticas se implementará reutilizando la estructura actual del backend sin crear nuevos servidores, microservicios ni módulos independientes.

Las estadísticas se tendrán que calcular desde el frontend, consumiendo endpoints del backend para obtener los datos necesarios.

---

# 7. Dashboards a Implementar

---

# MÓDULO A - Dashboard General Docente

## Ubicación

Vista general de dashboards ya existente en la web.

---

# Dashboard A1 - Tarjetas de Materias

## Objetivo

Mostrar:

* nombre materia
* alumnos inscritos
* progreso promedio

---

## Tipo visual

Cards

---

## Fuente BD

```text
tbl_materia
tbl_usuariomateria
tbl_progreso_subtema
```

---

## Endpoint

```http
GET /api/usuariomateria
GET /api/materia
GET /api/progreso-subtema
```

---

# Dashboard A2 - Contenido Académico Generado

## Objetivo

Mostrar actividad docente por periodo.

---

## Qué se medirá

* teorías creadas
* ejercicios creados
* recursos creados

---

## IMPORTANTE

NO medir modificaciones.

El sistema aún no posee auditoría.

---

## Tipo visual

Line Chart

---

## Fuente BD

```text
tbl_teoria
tbl_ejercicio
tbl_recurso_adjunto
```

---

# Dashboard A3 - Temas Más Activos

## Objetivo

Mostrar temas con mayor actividad estudiantil.

---

## Actividad definida como

Cantidad de intentos realizados.

---

## Tipo visual

Horizontal Bar Chart

---

## Fuente BD

```text
tbl_intento_ejercicio
tbl_subtema
tbl_tema
```

---
---

# Dashboard A4 - Usuarios Activos vs Inactivos

## Definición

Activo:
usuario con conexión en últimos 7 días.

---

## Tipo visual

Doughnut Chart

---

## Fuente BD

```text
tbl_ultima_conexion
```

---

## Sugerencia de cálculo

Consultar última conexión del usuario y si es mayor a 7 días de antiguedad, considerar al usuario como inactivo.

# MÓDULO B - Dashboard por Materia

## Ubicación

Dentro de la vista individual de cada materia.

---

# Dashboard B1 - Ejercicios con Más Errores

## Objetivo

Detectar ejercicios problemáticos.

---

## Métrica

```text
errores / intentos
```

---

## Tipo visual

Horizontal Bar Chart

---

## Interacción

Click → navegar al ejercicio.

-- Sugerencia --
Almacenar el id del ejercicio si es posible y relacionarlo con el área de contacto en el dashboard, después hacer un enrutamiento
a la página de ejercicio existente en vue con el id como argumento para consultar sus datos. SOLO IMPLEMENTAR SI ES FACTIBLE.

---

## Fuente BD

```text
tbl_intento_ejercicio
tbl_ejercicio
```
---

# Dashboard B2 - Temas Más Activos

## Objetivo

Mostrar actividad dentro de una materia.

---

## Métrica

Cantidad de intentos.

---

## Tipo visual

Bar Chart

---

## Fuente BD

```text
tbl_intento_ejercicio
tbl_tema
tbl_subtema
```

---

# Dashboard B3 - Progreso Promedio de Materia

## Objetivo

Mostrar avance promedio de estudiantes.

---

## Tipo visual

Progress Bar / Radial Chart

---

## Fuente BD

```text
tbl_progreso_subtema
```

---


# MÓDULO C - Dashboard por Ejercicio

## Ubicación

Vista individual del ejercicio.

---

# Dashboard C1 - Tiempo vs Aciertos

## Objetivo

Relacionar dificultad y rendimiento.

---

## Variables

| Eje            | Variable          |
| -------------- | ----------------- |
| X              | Tiempo promedio   |
| Y              | Promedio aciertos |

---

## Tipo visual

Bubble / Scatter Chart

---

## Fuente BD

```text
tbl_intento_ejercicio
```

---


# 9. Recomendaciones Críticas

---

## NO implementar

* Heatmaps
* IA
* ML
* Sistemas eventos
* Logs avanzados
* Auditoría completa
* ETL real

---

## Mantener enfoque

El objetivo es:

```text
un MVP analítico funcional,
estable y visualmente útil.
```

---

# 10. Conclusión Final

La arquitectura actual de SmartLearn ya soporta correctamente un módulo inicial de análisis de datos sin requerir rediseños profundos.

La estrategia correcta para esta semana es:

* reutilizar tablas existentes
* calcular métricas dinámicamente
* implementar dashboards simples pero útiles
* evitar sobreingeniería
* priorizar estabilidad y visualización

El resultado esperado debe ser una primera versión sólida y escalable del módulo analítico de SmartLearn.

# 11. Endpoints disponibles para el cálculo de estadísticas desde frontend:
--- DTOS ---
- Usuario: 
  public class UsuarioDto { 
    private Integer id; 
    private String nombreCuenta; 
    private String correo; 
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) private String contrasena; 
    private String nombreCompleto;
    private Boolean activo; 
    private Boolean verificado; 
    private Integer idRol; 
    private Integer idConfiguracion; 
    private Integer idUltimaConexion; 
    } 
    
- Ultima conexión public class UltimaConexionDto { 
    private Integer id; 
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") private String ultimaConexion; 
    private String dispositivo; private Integer idUsuario; private Integer idSubtema;
  } 
  
- Tema: public class TemaDto { 
    private Integer id; 
    private String nombre; 
    private Integer orden; 
    private Integer idMateria; 
  } 
  
- Progreso subtema public class ProgresoSubtemaDto { 
    private Integer id; 
    private boolean teoriaLeida; 
    private Integer ejerciciosCompletados; 
    private Integer ejerciciosTotales; 
    private double porcentaje; 
    private LocalDateTime ultimoAcceso; 
    private Integer idUsuario; 
    private Integer idSubtema; 
  } 
  
  - Ejercicio public class EjercicioDto { 
      private Integer id; 
      private String nombre; 
      private String tipo; 
      private Integer dificultad; 
      private Integer orden; 
      private Boolean activo; 
      private Integer idSubtema; 
    } 
    
  - Intento ejercicio public class EjercicioDto { 
      private Integer id; private String nombre; 
      private String tipo; private Integer dificultad; 
      private Integer orden; private Boolean activo; 
      private Integer idSubtema; 
    } 
    
  - Usuario Materia: public class UsuarioMateriaDto { 
      private Integer id; 
      private String suscritoEn; 
      private Integer idMateria; 
      private Integer idUsuario; 
    } 
    
  - Usuario Ejercicio: public class UsuarioEjercicioDto { 
      private Integer id; 
      private Integer idUsuario; 
      private Integer idEjercicio; 
      private boolean hecho; 
    }

  - Intento Ejercicio: public class IntentoEjercicioDto {
      private Integer id;
      private Double puntaje;
      private Integer duracionSeg;
      private String fecha;
      private String estado;

      private Integer idUsuario;
      private Integer idEjercicio;
    }

--- Endpoints ---
Los enpoints siguen la misma nomenclatura que los usados en la aplicación en general, por ejemplo:

@GetMapping("/intento-ejercicio")
    public ResponseEntity<List<IntentoEjercicioDto>> lista() {
        List<IntentoEjercicio> intentos = intentoEjercicioServicio.getAll();
        if (intentos == null || intentos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<IntentoEjercicioDto> dtos = intentos.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/intento-ejercicio/{id}")
    public ResponseEntity<IntentoEjercicioDto> findById(@PathVariable Integer id) {
        IntentoEjercicio intento = intentoEjercicioServicio.findById(id);
        if (intento == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(intento));
    }