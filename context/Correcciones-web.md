# SmartLearn Web — Correcciones Obligatorias de Vue para Producción

## Objetivo del documento

Este documento especifica las correcciones obligatorias que deben implementarse en el frontend Vue de SmartLearn para garantizar:

- Funcionamiento correcto en producción.
- Compatibilidad con Apache Reverse Proxy.
- Compatibilidad con Azure VM.
- Navegación SPA funcional.
- Persistencia de autenticación JWT.
- Compatibilidad con rutas `/web` y `/backend`.
- Eliminación de recargas completas de página.
- Correcto funcionamiento de Vue Router History Mode.

Este documento es obligatorio para cualquier desarrollador que trabaje en SmartLearn Web.

---

# Contexto de infraestructura actual

Actualmente SmartLearn se encuentra desplegado en:

- Backend Spring Boot → Puerto `8080`
- Frontend Vue/Vite → Puerto `4173`
- Apache funciona como Reverse Proxy.

Arquitectura actual:

```txt
Usuario
   ↓
Apache (Puerto 80)
   ├── /backend → Spring Boot :8080
   └── /web → Vue/Vite :4173

URLs reales del sistema:

Frontend:
http://marco-des.mexicocentral.cloudapp.azure.com/web

Backend:
http://marco-des.mexicocentral.cloudapp.azure.com/backend
Problema detectado

El frontend originalmente fue desarrollado como una SPA local utilizando:

localhost

y rutas raíz:

/

Sin embargo, en producción la aplicación vive dentro de:

/web

Esto provoca múltiples errores:

Recargas completas del navegador.
Login aparentemente exitoso pero sin navegación.
Errores silenciosos de Vue Router.
Rutas rotas.
Assets JS/CSS no encontrados.
Errores 404 en refresh.
Redirecciones inválidas.
Interceptor JWT enviando a rutas inexistentes.
CORRECCIONES OBLIGATORIAS
1. Configurar Vite correctamente
Archivo:
vue-frontend/vite.config.js
Implementación obligatoria
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/web/',
  plugins: [vue()]
})
Explicación técnica

La aplicación NO vive en /.

La aplicación vive en:

/web

Por lo tanto Vite debe generar:

/web/assets/index.js

y no:

/assets/index.js

Si esto no se configura:

CSS no carga.
JS no carga.
Vue Router falla.
El build queda roto en producción.
2. Configurar Vue Router correctamente
Archivo:
src/router/index.js
Implementación obligatoria

Cambiar:

history: createWebHistory(import.meta.env.BASE_URL)

por:

history: createWebHistory('/web/')
Explicación técnica

Vue Router debe comprender que toda la SPA está montada sobre:

/web

y no sobre:

/

Sin esto:

router.push() falla.
Refresh rompe la navegación.
Vue intenta navegar a rutas inexistentes.
3. TODAS las rutas hijas deben ser relativas
ERROR ACTUAL

Actualmente existen rutas hijas declaradas así:

{
  path: '/dashboard'
}

Esto es incorrecto.

IMPLEMENTACIÓN CORRECTA

Debe quedar:

{
  path: 'dashboard'
}
Rutas que deben corregirse

Todas estas:

/dashboard
/materias
/tema/:idMateria/:nombreMateria
/subtema/:idTema/:nombreTema
/teoria/:idSubtema/:nombreSubtema
/ejercicio
/crear-ejercicio
/crear-preguntas
/editar-ejercicio
/editar-pregunta
/usuario

deben convertirse en:

dashboard
materias
tema/:idMateria/:nombreMateria
subtema/:idTema/:nombreTema
teoria/:idSubtema/:nombreSubtema
ejercicio
crear-ejercicio
crear-preguntas
editar-ejercicio
editar-pregunta
usuario
Explicación técnica

En Vue Router:

children:[]

ya hereda la ruta padre.

Usar /dashboard dentro de children
rompe el árbol de navegación.

4. Corregir interceptor JWT
Archivo:
src/api/axios.js
ERROR ACTUAL
window.location.href = '/login';
IMPLEMENTACIÓN CORRECTA
window.location.href = '/web/auth/login';
Explicación técnica

La ruta /login NO existe en producción.

La ruta real es:

/web/auth/login
5. Corregir navegación post-login
Archivo:
LoginView.vue
ERROR ACTUAL
router.push('/dashboard');
IMPLEMENTACIÓN CORRECTA
router.push({ name: 'dashboard' });
Explicación técnica

La navegación por nombre es más segura.

Evita errores de rutas relativas/absolutas.

6. Corregir guardias de autenticación
Archivo:
router/index.js
ERROR ACTUAL
next('/login')
IMPLEMENTACIÓN CORRECTA
next('/auth/login')
Explicación técnica

La SPA vive en:

/web

Vue Router resolverá correctamente:

/web/auth/login
7. Axios debe usar la URL correcta
Archivo:
src/api/axios.js
Implementación correcta
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://marco-des.mexicocentral.cloudapp.azure.com/backend/smartlearn/api',
  headers: {
    'X-Client-Type': 'mobile'
  }
});

export default api;
Explicación técnica

Apache redirige:

/backend

hacia:

localhost:8080

Por lo tanto Vue jamás debe apuntar directamente a:

localhost:8080
8. Problema identificado en login

El endpoint de login funciona correctamente.

El problema identificado fue posterior al login.

Flujo real detectado:

POST /usuario/login/docente
    ↓
Backend responde correctamente
    ↓
Frontend intenta obtener perfil
    ↓
Router/redirect falla
    ↓
SPA se recarga

No era un problema de Spring Boot.

Era un problema de rutas absolutas en Vue.

9. Flujo correcto esperado
Login
POST /backend/smartlearn/api/usuario/login/docente

Respuesta:

{
  "token": "...",
  "idUsuario": 1,
  "nombreCuenta": "usuario",
  "idRol": 1
}
Navegación correcta
/web/dashboard
/web/materias
/web/tema/...
10. Rebuild obligatorio

Después de cualquier modificación:

npm run build
11. Reinicio obligatorio del frontend

Si se usa:

npm run preview

debe reiniciarse:

CTRL + C
npm run preview -- --host 0.0.0.0 --port 4173
12. Validaciones obligatorias

Antes de hacer commit:

Verificar:
1.
F12 → Network

No debe haber:

404
2.

No debe haber recargas completas de página.

3.

Las rutas deben navegar sin refresh.

4.

El login debe persistir tras recargar.

5.

El token JWT debe mantenerse en LocalStorage.

13. Consideraciones arquitectónicas futuras

El frontend SmartLearn evolucionará hacia:

Dashboard analítico.
Estadísticas académicas.
IA adaptativa.
Recomendaciones.
Métricas ETL.
Visualización de progreso.
Accesibilidad avanzada.

Por lo tanto:

La navegación SPA debe quedar completamente estable.
El manejo de JWT debe ser sólido.
Vue Router debe quedar correctamente estructurado.
El proyecto debe evitar rutas absolutas hardcodeadas.
Estado esperado al finalizar

El sistema debe permitir:

✅ Login funcional
✅ Navegación SPA correcta
✅ JWT persistente
✅ Compatibilidad Azure
✅ Compatibilidad Apache Reverse Proxy
✅ Rutas protegidas funcionales
✅ Layouts Vue correctos
✅ Refresh sin errores
✅ Build de producción estable
✅ Base sólida para estadísticas y analítica futura