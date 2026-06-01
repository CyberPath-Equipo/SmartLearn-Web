# Cambios Acordados para el Módulo de Dashboards de SmartLearn

## Objetivo

Ajustar los dashboards para que utilicen únicamente información realmente disponible en la base de datos y en los endpoints actuales del sistema, evitando métricas imposibles de calcular por falta de datos históricos o fechas de creación.

---

# Dashboard A1 - Resumen por Materia

## Estado anterior

La propuesta original mostraba:

- Nombre de la materia
- Alumnos inscritos
- Progreso promedio de la materia

## Problema detectado

Actualmente no existe un endpoint que permita obtener de forma masiva:

```java
ProgresoSubtemaDto

ni tampoco existe un endpoint que permita consultar el progreso de todos los usuarios de una materia.

Por lo tanto:

No es posible calcular el progreso promedio de una materia.
Solución adoptada

Reemplazar:

Progreso Promedio

por:

Cantidad de Temas
Información mostrada

Cada tarjeta mostrará:

Nombre de la materia
Cantidad de alumnos inscritos
Cantidad de temas disponibles
Endpoints utilizados
Obtener materias del docente
GET /usuario-materia/usuario/{idUsuario}/materias
Obtener alumnos inscritos
GET /usuario-materia/materia/{idMateria}/usuarios
Obtener temas de la materia
GET /materia/{idMateria}/temas
Cálculos realizados
Alumnos inscritos
usuariosMateria.length
Total de temas
temasMateria.length
Dashboard A2 - Distribución de Recursos Académicos
Estado anterior

La propuesta original mostraba:

Contenido generado por mes

comparando:

Teorías creadas
Ejercicios creados
Problema detectado

Los DTO actuales no almacenan:

fechaCreacion
createdAt
fechaRegistro

para:

Temas
Ejercicios
Teorías

Por lo tanto:

No es posible calcular actividad de creación por periodo de tiempo.

La gráfica actual produce resultados incorrectos porque todos los ejercicios son agrupados en una única categoría denominada "Actual".

Solución adoptada

Eliminar completamente la gráfica temporal.

Reemplazarla por:

Distribución de Recursos Académicos
Objetivo

Mostrar el contenido existente en cada materia.

Tipo de gráfica
Barra agrupada (Grouped Bar Chart)
Métricas

Por cada materia:

Cantidad de temas
Cantidad de teorías
Cantidad de ejercicios
Ejemplo
Materia	Temas	Teorías	Ejercicios
Cálculo	8	15	25
Física	6	10	18
Probabilidad	10	18	31
Endpoints utilizados
Obtener materias
GET /usuario-materia/usuario/{idUsuario}/materias
Obtener temas
GET /materia/{idMateria}/temas
Obtener subtemas
GET /tema/{idTema}/subtemas
Obtener teorías

Endpoint existente en el proyecto:

GET /subetema/{idSubtema}/teoria
Obtener ejercicios

Endpoint existente en el proyecto:

GET /subetema/{idSubtema}/ejercicio
Cálculos realizados
Total de temas
temasMateria.length
Total de ejercicios

Contar ejercicios cuya relación:

Materia
 → Tema
 → Subtema
 → Ejercicio

corresponda a la materia analizada.

Total de teorías

Contar teorías asociadas a los subtemas pertenecientes a la materia.

Dashboard A3 - Temas con Más Actividad
Estado

Se mantiene sin cambios.

Objetivo

Identificar los temas con mayor interacción por parte de los estudiantes.

Métrica utilizada
Cantidad de intentos realizados

sobre ejercicios pertenecientes al tema.

Endpoints utilizados
GET /intento-ejercicio
GET /ejercicio
GET /tema
GET /subtema
Cálculo
Intentos
→ Ejercicio
→ Subtema
→ Tema

Agrupar y contar.

Dashboard A4 - Usuarios Activos vs Inactivos
Estado

Se mantiene sin cambios.

Objetivo

Identificar el nivel de actividad de los estudiantes.

Regla de negocio

Usuario activo:

Última conexión ≤ 7 días

Usuario inactivo:

Última conexión > 7 días
Endpoints utilizados
GET /ultima-conexion
Cálculo

Agrupar por usuario.

Seleccionar la fecha más reciente.

Comparar contra la fecha actual.

Resumen Final
Dashboard	Estado
A1 Resumen por Materia	Modificado
A2 Actividad de Creación de Recursos	Eliminado
A2 Distribución de Recursos Académicos	Nuevo
A3 Temas con Más Actividad	Sin cambios
A4 Usuarios Activos vs Inactivos	Sin cambios
Beneficios
No requiere modificaciones al backend.
Utiliza únicamente información existente.
Elimina métricas imposibles de calcular.
Reduce complejidad del desarrollo.
Mantiene valor académico y funcional para la presentación final del proyecto.