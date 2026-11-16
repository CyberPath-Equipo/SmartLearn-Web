# SmartLearn Web

Frontend Vue 3 + Vite de SmartLearn.

## Configuración

La API se configura mediante `VITE_API_URL`:

- Desarrollo local: `http://localhost:8080/smartlearn/api`
- Producción: `https://smartlearn.westus.cloudapp.azure.com/smartlearn/api`

Los archivos `.env.development` y `.env.production` son locales y están
excluidos de Git. Usa `.env.example` como referencia. Las variables
`VITE_*` son públicas y no deben contener secretos.

## Desarrollo y despliegue

```bash
npm ci
npm run dev
```

Para generar el sitio estático de Cloudflare Pages:

```bash
npm ci
npm run build
```

La carpeta de salida es `dist/`. En Cloudflare Pages usa:

- Framework preset: `Vue`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `vue-frontend`

La configuración `public/_redirects` habilita el fallback de Vue Router.
El backend debe permitir mediante CORS el origen exacto de producción de
Cloudflare Pages y procesar las solicitudes `OPTIONS` antes de exigir JWT.
