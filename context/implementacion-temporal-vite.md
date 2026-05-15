# SmartLearn Web — Implementación Temporal de Comunicación Frontend ↔ Backend mediante Vite Proxy

---

# 1. Contexto General del Proyecto

## Arquitectura Actual

Actualmente SmartLearn posee una arquitectura desacoplada:

```text
Frontend Web (Vue.js)
        ↓
Peticiones HTTP JSON
        ↓
Backend Spring Boot (Azure VM)
```

El backend NO renderiza vistas HTML.

Toda la comunicación se realiza mediante:

- REST API
- JSON
- JWT personalizado

---

## Estado Actual del Proyecto

Actualmente:

| Área | Estado |
|---|---|
| Backend Spring Boot | Funcional |
| JWT personalizado | Funcional |
| Roles y permisos | Funcionales |
| Azure VM | Funcional |
| Android | Funcional |
| Vue.js | En desarrollo |
| CRUD Web | En desarrollo |

---

## Seguridad Implementada

El backend ya implementa:

- JWT propio
- Spring Security personalizado
- Filtros JWT
- BrowserBlockFilter
- Roles por endpoint
- Protección de rutas API

---

# 2. Problemática Detectada

## Situación Actual

Durante desarrollo local:

Frontend:

```text
http://localhost:5173
```

Backend Azure:

```text
http://marco-des.mexicocentral.cloudapp.azure.com
```

---

## Problema

El navegador considera ambos como:

# Orígenes diferentes

Esto activa automáticamente:

# Política CORS

---

## Consecuencias

El navegador:

1. Envía una petición `OPTIONS`
2. Spring Security intercepta la petición
3. BrowserBlockFilter/Security responde con redirect o bloqueo
4. El navegador cancela la petición

---

## Errores Detectados

```text
Redirect is not allowed for a preflight request
```

```text
Blocked by CORS policy
```

```text
net::ERR_FAILED
```

---

# 3. Análisis Arquitectónico

## Importante

El backend actualmente:

- SÍ autentica correctamente
- SÍ genera JWT
- SÍ responde
- SÍ consulta la base de datos
- SÍ funciona en Azure

El problema NO está en JWT.

El problema NO está en Axios.

El problema NO está en Vue.

---

# El problema real es:

```text
Navegador + Desarrollo Local + CORS
```

---

# 4. Decisión Arquitectónica

## Decisión Tomada

# NO modificar Spring Security actualmente.

---

## Motivos

Modificar Spring Security actualmente implica:

| Riesgo | Impacto |
|---|---|
| Romper Android | Alto |
| Romper JWT | Alto |
| Romper roles | Alto |
| Abrir vulnerabilidades | Alto |
| Retrasar desarrollo | Alto |

---

## Contexto del Equipo

Actualmente:

- El equipo tiene poco tiempo
- No existe experiencia avanzada en Spring Security
- La prioridad es avanzar frontend rápidamente
- Android ya depende del backend actual

---

# 5. Solución Elegida

# Vite Proxy

---

## ¿Qué hace?

Vite actuará como intermediario:

```text
Vue Frontend
      ↓
Vite Proxy
      ↓
Spring Boot Azure
```

---

## Resultado

El navegador creerá que:

```text
Frontend y backend son el mismo origen
```

---

## Consecuencias Positivas

- NO habrá CORS
- NO habrá preflight problemático
- BrowserBlockFilter no afectará desarrollo
- JWT seguirá funcionando
- Android no será afectado
- No será necesario modificar seguridad

---

# IMPORTANTE

# Esto SOLO aplica para desarrollo local.

---

# Producción futura

Más adelante:

```text
Nginx / Apache
 ├── Frontend compilado
 └── /api → Spring Boot
```

Y tampoco existirá CORS.

---

# 6. Implementación Paso a Paso

---

# FASE 1 — Configuración Vite Proxy

---

## Paso 1 — Abrir archivo Vite

Ubicación:

```text
raiz-proyecto-web/vite.config.js
```

---

## Paso 2 — Configurar proxy

Reemplazar o agregar:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/smartlearn': {
        target: 'http://marco-des.mexicocentral.cloudapp.azure.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

---

# Explicación Técnica

## `/smartlearn`

Toda petición:

```text
/smartlearn/api/...
```

será reenviada automáticamente al backend Azure.

---

## `target`

Indica el backend real.

---

## `changeOrigin`

Hace que Vite simule correctamente el origen.

---

## `secure: false`

Evita problemas SSL durante desarrollo.

---

# FASE 2 — Configuración Axios

---

## Paso 1 — Abrir Axios

Ejemplo:

```text
src/api/axios.js
```

---

## Paso 2 — Modificar baseURL

ANTES:

```js
baseURL: 'http://marco-des.mexicocentral.cloudapp.azure.com/smartlearn/api'
```

---

DESPUÉS:

```js
baseURL: '/smartlearn/api'
```

---

# Explicación

Ahora Axios:

- NO llamará directamente Azure
- llamará al servidor Vite local
- Vite reenviará automáticamente la petición

---

# FASE 3 — Configuración Header Cliente

---

## Paso 1 — Agregar Header

Modificar Axios:

```js
const api = axios.create({
  baseURL: '/smartlearn/api',

  headers: {
    'X-Client-Type': 'mobile'
  }
});
```

---

# Explicación

El backend implementa:

```text
BrowserBlockFilter
```

Este filtro detecta navegadores.

El header:

```http
X-Client-Type: mobile
```

permite tratar la petición como cliente móvil/API.

---

# IMPORTANTE

NO agregar manualmente:

```http
User-Agent
```

Los navegadores modernos normalmente bloquean modificar ese header.

---

# FASE 4 — Verificación JWT

---

## Verificar interceptor

Debe existir:

```js
api.interceptors.request.use(
  config => {

    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);
```

---

# Explicación

Esto permite:

```text
JWT automático en cada petición
```

---

# FASE 5 — Reiniciar Proyecto

---

## Paso 1 — Detener Vite

```bash
CTRL + C
```

---

## Paso 2 — Ejecutar nuevamente

```bash
npm run dev
```

---

# FASE 6 — Verificación Final

---

## Verificar Login

El login debe:

- generar JWT
- almacenar token
- obtener perfil usuario
- navegar correctamente

---

## Verificar DevTools

En:

```text
F12 → Network
```

NO deben aparecer:

```text
Blocked by CORS policy
```

---

## Verificar Headers

Debe existir:

```http
Authorization: Bearer ...
```

---

## Verificar LocalStorage

Debe existir:

```text
token
user
```

---

# 7. Resultado Esperado

Arquitectura temporal final:

```text
Vue Frontend
      ↓
Vite Proxy
      ↓
Spring Boot Azure
      ↓
JWT + Seguridad
```

---

# 8. Beneficios de la Solución

| Beneficio | Resultado |
|---|---|
| No modificar seguridad | Backend estable |
| No afectar Android | Compatibilidad mantenida |
| Desarrollo rápido | Sí |
| Menor riesgo | Sí |
| Arquitectura desacoplada | Sí |
| Compatible con SaaS futuro | Sí |
| Compatible con Azure | Sí |

---

# 9. Consideraciones Futuras

Más adelante será necesario:

- Refinar CORS real
- Refinar Spring Security
- Configurar Nginx
- Automatizar despliegue
- Integrar frontend compilado
- Implementar entorno staging

---

# 10. Conclusión Técnica

Actualmente:

# Vite Proxy es la solución más segura, rápida y adecuada para el estado actual del proyecto.

Permite:

- continuar desarrollo frontend,
- mantener estable el backend,
- evitar riesgos en seguridad,
- y mantener compatibilidad completa con Android y JWT.