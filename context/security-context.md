# chatgpt-14-05-2026-implementacion-web-fases-smartlearn.md

# Objetivo

Definir el plan oficial de implementación de SmartLearn Web, estableciendo:

- arquitectura objetivo
- tecnologías seleccionadas
- estado actual del proyecto
- integración con backend existente
- estrategia de seguridad
- organización por fases
- responsabilidades técnicas
- lineamientos de desarrollo

El objetivo es construir una plataforma web administrativa moderna, mantenible y escalable progresivamente, sin comprometer la estabilidad del backend actual de SmartLearn.

---

# Contexto

SmartLearn actualmente posee:

## Backend funcional

Desarrollado con:

- Spring Boot
- Hibernate/JPA
- MySQL
- JWT
- Spring Security parcialmente integrado

El backend ya se encuentra desplegado en una máquina virtual de Azure y actualmente:

- maneja múltiples usuarios
- posee autenticación JWT
- implementa control de acceso
- utiliza roles/permisos básicos
- protege endpoints mediante filtros

---

## Aplicación móvil Android

La app móvil funciona como cliente principal orientado a estudiantes y actualmente:

- consume la API REST
- almacena JWT
- maneja autenticación
- utiliza navegación mediante Fragments

---

## Plataforma Web

La web actualmente se encuentra en estado inicial y solo cuenta con:

- HTML
- CSS
- JavaScript estático

Todavía NO existe:

- framework frontend
- compilación frontend
- modularización
- estado global
- SPA formal
- sistema de componentes

---

## Equipo de desarrollo

El equipo actualmente:

- es pequeño (3 desarrolladores)
- tiene tiempo limitado
- posee experiencia básica/intermedia en JavaScript
- NO posee experiencia en frameworks frontend modernos
- tiene conocimientos básicos de Linux y Azure

---

# Arquitectura actual

## Arquitectura backend

```text
Android/Web
      ↓
Spring Boot REST API
      ↓
MySQL
```

---

## Seguridad actual

El backend implementa:

- JWT
- filtros personalizados
- control de autenticación
- validación de endpoints
- BrowserBlockFilter
- Spring Security parcial

---

## BrowserBlockFilter

El backend contiene un filtro llamado:

```text
BrowserBlockFilter
```

Este filtro:

- bloquea accesos GET desde navegadores sin JWT
- permite accesos autenticados con Bearer Token
- NO bloquea aplicaciones SPA autenticadas
- NO interfiere con Axios autenticado

Su objetivo principal es:

- evitar exploración directa de endpoints
- proteger APIs desde navegador
- mejorar experiencia de acceso restringido

---

# Decisión arquitectónica

## Arquitectura seleccionada

Se implementará una arquitectura SPA desacoplada:

```text
Vue SPA
    ↓
Axios + JWT
    ↓
Spring Boot REST API
    ↓
MySQL
```

---

# Tecnologías seleccionadas

## Frontend

Se utilizará:

- Vue.js
- Vite
- Pinia
- Axios
- Chart.js

---

## Infraestructura

Se utilizará:

- Azure VM
- Linux
- Nginx
- Spring Boot actual

---

# Razones de la decisión

Las tecnologías fueron seleccionadas considerando:

- tiempo limitado del equipo
- curva de aprendizaje
- simplicidad
- mantenibilidad
- tamaño del proyecto
- experiencia técnica actual
- evolución progresiva futura

---

# Tecnologías descartadas temporalmente

NO se utilizarán actualmente:

- Angular
- React
- Next.js
- Nuxt
- TypeScript
- GraphQL
- SSR
- Microfrontends
- Docker
- Kubernetes

---

# Objetivos funcionales de SmartLearn Web

La plataforma web estará enfocada principalmente en:

- docentes
- administradores
- CRUD académico
- paneles administrativos
- dashboards
- analytics

NO estará enfocada inicialmente en:

- IA conversacional
- tiempo real
- videollamadas
- colaboración simultánea

---

# Estrategia general

## Principio principal

NO modificar drásticamente el backend existente.

El backend actual ya se considera:

- funcional
- estable
- desacoplado
- reutilizable

La web será implementada como:

> Un cliente adicional del backend REST.

---

# FASE 1 — Preparación del entorno frontend

# Objetivo

Preparar el entorno de desarrollo Vue.

---

# Responsables

Frontend/Web developer

---

# Actividades

## Instalar Node.js y npm

Verificar instalación:

```bash
node -v
npm -v
```

---

## Crear proyecto Vue

```bash
npm create vite@latest
```

Seleccionar:

- Vue
- JavaScript

---

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar proyecto local

```bash
npm run dev
```

---

## Aprender fundamentos Vue

Aprender:

- componentes
- props
- emits
- router
- reactividad
- estructura SPA

---

# Resultado esperado

Proyecto Vue funcional ejecutándose localmente.

---

# FASE 2 — Arquitectura base frontend

# Objetivo

Crear estructura modular mantenible.

---

# Actividades

## Instalar dependencias principales

```bash
npm install vue-router pinia axios chart.js
```

---

## Crear estructura del proyecto

```text
src/
 ├── api/
 ├── assets/
 ├── components/
 ├── layouts/
 ├── router/
 ├── services/
 ├── stores/
 ├── utils/
 └── views/
```

---

## Configurar Vue Router

Rutas iniciales:

- Login
- Dashboard
- Usuarios
- Materias
- Analytics

---

## Crear layout administrativo

Implementar:

- sidebar
- navbar
- contenedor principal

---

# Resultado esperado

Frontend modular listo para integración.

---

# FASE 3 — Integración con backend

# Objetivo

Conectar frontend con backend actual mediante JWT.

---

# Actividades Backend

## Verificar CORS

Permitir:

- localhost frontend
- IP frontend
- dominio futuro

---

## Confirmar endpoints públicos

Ejemplo:

- login
- verify2fa

---

## Confirmar respuestas HTTP

Verificar:

- 401
- 403
- errores JWT

---

# Actividades Frontend

## Crear AuthService

Implementar:

- login
- logout
- verify2fa
- getProfile

---

## Crear Auth Store con Pinia

Guardar:

- JWT
- usuario
- rol
- estado autenticación

---

## Configurar Axios Interceptors

Agregar automáticamente:

```http
Authorization: Bearer TOKEN
```

---

## Manejar expiración JWT

Cuando ocurra:

- 401
- token inválido

realizar:

- logout
- redirección login

---

# Resultado esperado

Sistema autenticado completamente funcional.

---

# FASE 4 — Permisos y seguridad frontend

# Objetivo

Integrar autorización basada en roles/permisos.

---

# Actividades

## Crear Route Guards

Proteger:

- dashboard
- analytics
- CRUDs

---

## Obtener perfil usuario

Debido a que el JWT NO contiene roles:

El frontend deberá:

```text
Login
↓
Guardar JWT
↓
Consultar perfil usuario
↓
Guardar rol/permisos
```

---

## Ocultar módulos según rol

Ejemplo:

```text
ADMIN
 ├── Usuarios
 ├── Analytics
 └── Configuración

DOCENTE
 ├── Materias
 ├── Ejercicios
 └── Alumnos
```

---

# Resultado esperado

Frontend alineado con backend seguro.

---

# FASE 5 — CRUD administrativos

# Objetivo

Implementar funcionalidades principales del sistema.

---

# Actividades

## CRUD Materias

- crear
- editar
- eliminar
- listar

---

## CRUD Temas/Subtemas

---

## CRUD Ejercicios

---

## Gestión usuarios

---

## Validaciones frontend

---

## Manejo errores globales

---

# Resultado esperado

Panel administrativo funcional.

---

# FASE 6 — Dashboards y analytics

# Objetivo

Visualizar estadísticas académicas.

---

# Herramienta

Chart.js

---

# Actividades

## Dashboard principal

---

## Estadísticas académicas

---

## Métricas de usuarios

---

## Gráficas de progreso

---

# Resultado esperado

Sistema analytics funcional.

---

# FASE 7 — Despliegue Azure

# Objetivo

Publicar SmartLearn Web.

---

# Arquitectura final inicial

```text
Internet
   ↓
Nginx
   ├── Vue SPA
   └── /api → Spring Boot
```

---

# Actividades

## Compilar frontend

```bash
npm run build
```

---

## Instalar Nginx

---

## Configurar reverse proxy

```text
/api → Spring Boot
```

---

## Servir carpeta dist

---

## Validar:
- JWT
- CORS
- rutas
- permisos
- dashboards

---

# Resultado esperado

Sistema desplegado funcionalmente en Azure.

---

# FASE 8 — Evolución futura

# Objetivo

Preparar crecimiento SaaS.

---

# Mejoras futuras backend

- refresh tokens
- permisos granulares
- respuestas JSON unificadas
- logging estructurado
- observabilidad

---

# Mejoras futuras frontend

- UX avanzada
- loaders
- persistencia segura
- optimización dashboards
- manejo avanzado sesiones

---

# Mejoras futuras infraestructura

- HTTPS
- dominio propio
- CI/CD
- backups
- monitoreo
- Docker
- App Services

---

# Qué NO hacer actualmente

NO:

- reescribir backend
- migrar a microservicios
- usar TypeScript
- implementar arquitectura enterprise compleja
- usar SSR
- usar Kubernetes
- introducir demasiadas dependencias

---

# Trabajo realizado

- análisis del backend actual
- análisis JWT
- análisis Spring Security
- análisis BrowserBlockFilter
- definición de arquitectura frontend
- selección de tecnologías
- definición de estrategia Azure
- definición de estrategia JWT frontend
- definición de fases implementación

---

# Problemas/dudas actuales

## Riesgos actuales

- poca experiencia frontend moderna
- tiempo limitado
- backend híbrido JWT/sesión
- permisos aún poco granulares

---

## Riesgos futuros

- crecimiento SaaS
- aumento complejidad permisos
- refresh tokens ausentes
- necesidad futura de observabilidad

---

# Conclusiones

- Vue.js representa la mejor opción para SmartLearn actualmente.
- El backend actual ya está preparado para soportar SmartLearn Web.
- BrowserBlockFilter NO representa un bloqueo para Vue SPA autenticado.
- La arquitectura desacoplada frontend/backend es correcta para el estado del proyecto.
- La prioridad debe ser simplicidad y mantenibilidad.
- El proyecto debe evolucionar progresivamente evitando sobreingeniería.

---

# Pendientes

- configurar proyecto Vue
- aprender fundamentos Vue
- implementar Axios
- implementar Pinia
- implementar JWT frontend
- implementar route guards
- crear CRUDs
- crear dashboards
- desplegar frontend
- configurar Nginx
- validar seguridad completa
- evaluar HTTPS futuro