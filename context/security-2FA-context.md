# SmartLearn - Flujo de Autenticación 2FA (Backend Spring Boot)

## Objetivo del documento

Este documento explica el funcionamiento real del sistema de autenticación y verificación 2FA implementado en el backend Spring Boot de SmartLearn.

Está dirigido a desarrolladores que:

* trabajarán en frontend Vue
* consumirán endpoints protegidos
* integrarán login/registro
* mantendrán el flujo de autenticación
* implementarán pantallas de verificación

---

# Arquitectura General

El sistema utiliza:

* Spring Security
* JWT Access Tokens
* Refresh Tokens
* Verificación por correo electrónico
* 2FA por EMAIL y TOTP
* Trusted Devices
* Recovery Codes

---

# Componentes Principales

## Controladores

### UsuarioControlador

Endpoints:

* `/smartlearn/api/usuario/login`
* `/smartlearn/api/usuario/login/docente`
* `/smartlearn/api/usuario/registro`
* `/smartlearn/api/usuario/registro/verificar`

Responsable de:

* login inicial
* registro
* emisión de JWT
* inicio de flujos 2FA

---

### TwoFactorControlador

Endpoints:

* `/smartlearn/api/usuario/2fa/*`

Responsable de:

* setup 2FA
* confirmación
* verificación OTP
* resend
* trusted devices
* desactivación

---

# Servicios Principales

## TwoFactorServicioImpl

Implementa toda la lógica de:

* generación de códigos
* validación OTP
* generación de transacciones
* TOTP
* trusted devices
* recovery codes
* expiración
* envío de correos

---

# Configuración de Seguridad

## SecurityConfig

Define:

* endpoints públicos
* endpoints protegidos
* filtros JWT
* permisos

---

## JwtAuthFilter

Responsable de:

* validar JWT
* autenticar usuarios
* renovar access tokens
* procesar refresh tokens

---

# Flujo Completo del Sistema

---

# 1. Registro de Usuario

## Endpoint

```http
POST /smartlearn/api/usuario/registro
```

## Request

```json
{
  "nombreCuenta": "usuario",
  "correo": "usuario@mail.com",
  "contrasena": "123456",
  "idRol": 3
}
```

## Comportamiento

El backend:

1. crea el usuario
2. genera una transacción de verificación
3. envía código OTP al correo
4. retorna transactionId

---

## Response

```json
{
  "message": "Código de verificación enviado al correo registrado",
  "requiresVerification": true,
  "transactionId": "tx_abc123",
  "correo": "usuario@mail.com"
}
```

---

# 2. Verificación de Registro

## Endpoint

```http
POST /smartlearn/api/usuario/registro/verificar
```

## Request

```json
{
  "transactionId": "tx_abc123",
  "code": "123456"
}
```

---

## Comportamiento

El sistema:

* valida código OTP
* valida expiración
* marca usuario como:

  * activo
  * verificado

---

# 3. Login Normal

## Endpoint

```http
POST /smartlearn/api/usuario/login
```

o

```http
POST /smartlearn/api/usuario/login/docente
```

---

## Request

```json
{
  "nombreCuenta": "usuario",
  "contrasena": "123456"
}
```

---

# Escenario A — Usuario SIN 2FA

El backend responde inmediatamente con:

```json
{
  "token": "...",
  "refreshToken": "...",
  "idUsuario": 1,
  "nombreCuenta": "usuario",
  "idRol": 2
}
```

---

# Escenario B — Usuario CON 2FA

El backend NO entrega JWT aún.

Retorna:

```json
{
  "requires2fa": true,
  "twoFactorTransactionId": "tx_abc123",
  "twoFactorChannel": "EMAIL"
}
```

El frontend debe:

1. guardar transactionId
2. mostrar pantalla OTP
3. consumir `/2fa/verify`

---

# 4. Verificación 2FA

## Endpoint

```http
POST /smartlearn/api/usuario/2fa/verify
```

---

## Request

```json
{
  "transactionId": "tx_abc123",
  "code": "123456",
  "rememberDevice": true,
  "deviceInfo": "Chrome Windows"
}
```

---

## Comportamiento

El backend:

* valida OTP
* valida expiración
* verifica recovery codes
* genera JWT
* genera refresh token
* opcionalmente crea trusted device

---

## Response

```json
{
  "token": "...",
  "refreshToken": "...",
  "trustedDeviceToken": "...",
  "requires2fa": false
}
```

---

# 5. Setup de 2FA

## Endpoint

```http
POST /smartlearn/api/usuario/2fa/setup
```

## Requiere JWT

```http
Authorization: Bearer <token>
```

---

## Request

```json
{
  "password": "123456",
  "method": "EMAIL"
}
```

o

```json
{
  "password": "123456",
  "method": "TOTP"
}
```

---

# Tipos Soportados

| Método | Estado    |
| ------ | --------- |
| EMAIL  | Funcional |
| TOTP   | Funcional |
| SMS    | Parcial   |

---

# Setup EMAIL

Genera:

* transactionId
* código OTP
* recovery codes

---

# Setup TOTP

Genera:

* secret TOTP
* provisioningUri
* QR compatible con Google Authenticator

---

## Response TOTP

```json
{
  "secret": "BASE32SECRET",
  "provisioningUri": "otpauth://...",
  "transactionId": "tx_abc123",
  "recoveryCodes": []
}
```

---

# 6. Confirmar Setup 2FA

## Endpoint

```http
POST /smartlearn/api/usuario/2fa/confirm-setup
```

---

## Request

```json
{
  "transactionId": "tx_abc123",
  "code": "123456",
  "tempSecret": "BASE32SECRET"
}
```

---

## Comportamiento

El backend:

* valida OTP
* activa 2FA
* guarda configuración
* genera recovery codes
* habilita trusted devices

---

# 7. Reenvío de Código

## Endpoint

```http
POST /smartlearn/api/usuario/2fa/resend
```

---

## Request

```json
{
  "transactionId": "tx_abc123"
}
```

---

# 8. Desactivar 2FA

## Endpoint

```http
POST /smartlearn/api/usuario/2fa/disable
```

---

## Request

```json
{
  "password": "123456",
  "code": "123456"
}
```

---

# Trusted Devices

---

# Concepto

Permiten evitar pedir OTP en futuros logins.

---

# Expiración

```text
30 días
```

---

# Endpoint Listado

```http
GET /smartlearn/api/usuario/2fa/devices
```

---

# Endpoint Revocación

```http
DELETE /smartlearn/api/usuario/2fa/devices/{deviceId}
```

---

# Seguridad JWT

---

# Access Token

Usado para:

* endpoints protegidos
* autorización

---

# Refresh Token

Usado para:

* renovar access tokens expirados

---

# Renovación Automática

`JwtAuthFilter` soporta:

```http
X-Refresh-Token
```

y responde con:

```http
X-New-Access-Token
```

---

# Endpoints Públicos

No requieren JWT:

```text
/smartlearn/api/usuario/login
/smartlearn/api/usuario/login/docente
/smartlearn/api/usuario/registro
/smartlearn/api/usuario/registro/verificar
/smartlearn/api/usuario/2fa/verify
/smartlearn/api/usuario/2fa/resend
/smartlearn/api/usuario/token/refresh
```

---

# Expiraciones Importantes

| Elemento       | Tiempo               |
| -------------- | -------------------- |
| OTP            | 5 minutos            |
| Trusted Device | 30 días              |
| Recovery Codes | Permanente hasta uso |

---

# Recovery Codes

Se generan:

* al activar 2FA
* 10 códigos únicos

Permiten:

* acceder sin OTP principal

---

# Notas Críticas para Desarrolladores

---

# 1. NO modificar endpoints del backend

El frontend Vue depende completamente de:

* rutas
* payloads
* estructura JSON

Cambios romperán:

* login
* refresh
* guards
* 2FA
* sesiones

---

# 2. TOTP actualmente NO está cifrado

Actualmente:

```java
encryptSecret()
decryptSecret()
```

NO implementan cifrado real.

Esto debe corregirse en producción.

---

# 3. Trusted Device incompleto

La infraestructura existe,
pero el login aún no usa automáticamente:

```text
trustedDeviceToken
```

para omitir OTP.

---

# 4. El frontend DEBE manejar estados 2FA

El frontend debe detectar:

```json
{
  "requires2fa": true
}
```

y redirigir a pantalla OTP.

---

# 5. Importante para Vue + Axios

El frontend debe usar SIEMPRE:

```js
Authorization: Bearer <token>
```

para endpoints protegidos.

---

# 6. HTTPS obligatorio

Con SSL activo:

* frontend debe consumir backend usando HTTPS
* nunca usar `http://`

Ejemplo correcto:

```js
baseURL: 'https://dominio/smartlearn/api'
```

---

# Flujo Recomendado Frontend

```text
Registro
→ Verificación correo
→ Login
→ requires2fa?
    → Sí:
        Pantalla OTP
        → verify
        → recibir JWT
    → No:
        acceso inmediato
```

---

# Conclusión

El sistema de autenticación SmartLearn implementa:

* JWT
* Refresh Tokens
* OTP Email
* TOTP
* Trusted Devices
* Recovery Codes

Toda la lógica central reside en:

* Spring Security
* JwtAuthFilter
* TwoFactorServicioImpl

El frontend Vue debe respetar completamente:

* endpoints
* payloads
* flujos
* respuestas JSON

para evitar romper el sistema de autenticación.