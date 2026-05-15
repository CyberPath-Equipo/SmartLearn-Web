# SmartLearn Web — Resumen de Avance Arquitectónico del Commit

---

# 1. Información General

| Campo | Información |
|---|---|
| Proyecto | SmartLearn |
| Módulo | Plataforma Web |
| Tipo de commit | Avance arquitectónico y comunicación frontend-backend |
| Arquitectura | Frontend desacoplado + Backend Spring Boot |
| Estado | En desarrollo |
| Entorno principal | Azure VM |
| Framework frontend | Vue.js |
| Gestión estado frontend | Pinia |
| Cliente HTTP | Axios |
| Backend | Spring Boot |
| Seguridad | JWT personalizado + Spring Security personalizado |

---

# 2. Objetivo del Commit

Este commit tiene como objetivo establecer la base arquitectónica y funcional de la plataforma web SmartLearn para permitir:

- Comunicación estable frontend ↔ backend
- Integración JWT
- Gestión de autenticación
- Manejo de roles
- Persistencia de sesión
- Base para CRUD administrativo
- Compatibilidad con infraestructura Azure existente
- Compatibilidad con arquitectura móvil ya implementada

---

# 3. Contexto Arquitectónico

La plataforma SmartLearn utiliza una arquitectura desacoplada:

```text
Frontend Web (Vue.js)
        ↓
REST API JSON
        ↓
Spring Boot Backend
        ↓
Base de Datos
```

El backend NO renderiza páginas HTML.

Toda la lógica visual se encuentra en Vue.js.

---

# 4. Estado del Backend al Momento del Commit

El backend ya cuenta con:

- JWT funcional
- Endpoints REST funcionales
- Roles y permisos
- Spring Security personalizado
- BrowserBlockFilter
- Persistencia funcional
- Azure VM operativa
- Android operativo usando la misma API

---

# 5. Objetivos Funcionales de la Plataforma Web

La web está orientada principalmente a:

- Docentes
- Administradores

Funciones esperadas:

- CRUD académico
- Gestión de materias
- Gestión de temas
- Gestión de usuarios
- Dashboards administrativos
- Analítica académica
- Estadísticas de cursos
- Administración general

---

# 6. Decisiones Arquitectónicas Tomadas

---

## 6.1 Frontend desacoplado

Se decidió mantener:

```text
Frontend separado del backend
```

Motivos:

- Escalabilidad
- Compatibilidad SaaS futura
- Mejor mantenimiento
- Separación de responsabilidades
- Compatibilidad con Android

---

## 6.2 Vue.js como Framework Principal

Se decidió utilizar Vue.js debido a:

- Curva de aprendizaje baja
- Bajo tiempo de implementación
- Fácil integración
- Arquitectura ligera
- Menor complejidad que Angular
- Mejor velocidad de desarrollo para equipo pequeño

---

## 6.3 Pinia para estado global

Pinia será utilizado para:

- Sesión usuario
- JWT
- Estado autenticación
- Roles
- Información global

---

## 6.4 Axios para comunicación HTTP

Axios se utilizará para:

- REST API
- Inyección automática JWT
- Manejo de interceptores
- Manejo centralizado de errores

---

# 7. Implementación JWT Frontend

---

## Flujo implementado

```text
Usuario inicia sesión
        ↓
Vue envía credenciales
        ↓
Spring Boot valida
        ↓
Spring genera JWT
        ↓
Vue almacena token
        ↓
Axios inyecta token automáticamente
        ↓
Endpoints protegidos disponibles
```

---

## Persistencia local

Se implementó:

```text
localStorage
```

para almacenar:

- token
- usuario

---

## Interceptor Axios

Se implementó interceptor para:

```text
Authorization: Bearer <token>
```

automáticamente.

---

# 8. Seguridad Backend Integrada

---

## BrowserBlockFilter

El backend implementa un filtro personalizado:

```text
BrowserBlockFilter
```

Funciones:

- Detectar navegadores
- Limitar acceso directo navegador
- Permitir clientes API
- Diferenciar móvil/web/API

---

## Header Cliente

Se decidió utilizar:

```http
X-Client-Type: mobile
```

para evitar bloqueos innecesarios durante desarrollo frontend.

---

# 9. Problemática Detectada

---

## Error Principal

Durante desarrollo local apareció:

```text
Blocked by CORS policy
```

---

## Causa

Frontend:

```text
localhost:5173
```

Backend:

```text
Azure VM
```

El navegador considera ambos orígenes diferentes.

---

## Consecuencia

- Preflight OPTIONS
- Redirects bloqueados
- Peticiones canceladas

---

# 10. Decisión Técnica para Resolver CORS

---

## Decisión

NO modificar Spring Security actualmente.

---

## Motivos

- Android depende del backend actual
- JWT ya funciona
- Seguridad personalizada compleja
- Riesgo elevado
- Poco tiempo de desarrollo

---

## Solución elegida

# Vite Proxy

---

# 11. Implementación Vite Proxy

---

## Objetivo

Evitar CORS durante desarrollo local.

---

## Flujo final

```text
Vue Frontend
      ↓
Vite Proxy
      ↓
Spring Boot Azure
```

---

## Beneficios

- Sin modificar backend
- Sin modificar JWT
- Sin modificar Android
- Sin modificar Spring Security

---

# 12. Arquitectura Temporal Resultante

```text
Vue.js
   ↓
Vite Dev Server
   ↓
Vite Proxy
   ↓
Spring Boot Azure
   ↓
JWT + Seguridad
```

---

# 13. Estado Actual del Desarrollo

---

## Funcionalidades alcanzadas

| Funcionalidad | Estado |
|---|---|
| Vue.js inicial | Implementado |
| Pinia | Implementado |
| Axios | Implementado |
| Login JWT | Implementado |
| Persistencia sesión | Implementado |
| Interceptor JWT | Implementado |
| Comunicación Azure | Implementado |
| Integración Backend | Implementado |
| Solución CORS | Definida |
| Arquitectura desacoplada | Consolidada |

---

# 14. Riesgos Detectados

| Riesgo | Estado |
|---|---|
| Complejidad Spring Security | Alto |
| Tiempo limitado desarrollo | Alto |
| Equipo pequeño | Medio |
| Experiencia frontend limitada | Medio |
| Experiencia Azure limitada | Medio |

---

# 15. Estrategia de Desarrollo Actual

La estrategia actual del proyecto es:

- Minimizar riesgos
- No modificar backend estable
- Priorizar velocidad desarrollo
- Mantener compatibilidad Android
- Consolidar frontend progresivamente
- Escalar arquitectura posteriormente

---

# 16. Futuro de la Arquitectura

Más adelante se planea:

- Refinar CORS real
- Refinar Spring Security
- Integrar Nginx
- Automatizar despliegues
- Compilar frontend producción
- Arquitectura SaaS
- Multiusuario completo
- Dashboards avanzados
- Analítica académica

---

# 17. Conclusión

Este commit consolida la primera base arquitectónica funcional de SmartLearn Web.

Se establecen correctamente:

- comunicación frontend-backend,
- autenticación JWT,
- persistencia sesión,
- integración Azure,
- desacoplamiento frontend,
- y una estrategia segura para continuar desarrollo sin afectar Android ni el backend actual.

La arquitectura actual prioriza:

- estabilidad,
- velocidad de desarrollo,
- bajo riesgo,
- y escalabilidad futura.