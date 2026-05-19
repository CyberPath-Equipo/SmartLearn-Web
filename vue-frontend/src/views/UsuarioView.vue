<template>
  <div class="usuario-view">

    <!-- ========== PERFIL ========== -->
    <section v-if="seccionActiva === 'perfil'" class="card perfil-card">
      <div class="perfil-header">
        <img src="/images/perfilUsuario.png" alt="perfil del Usuario" class="img-perfil" />
        <h2>Perfil de Usuario</h2>
      </div>

      <div v-if="cargando" class="estado-carga">
        <span class="spinner"></span> Cargando datos...
      </div>

      <section v-else class="info-usr">
        <div class="info-row">
          <span class="campo">Nombre:</span>
          <span class="valor">{{ usuario.nombreCuenta }}</span>
        </div>
        <div class="info-row">
          <span class="campo">Correo:</span>
          <span class="valor">{{ usuario.correo }}</span>
        </div>

        <div class="perfil-acciones">
          <button class="btn-primary" @click="solicitarAutenticacion('password')">
            Cambiar contraseña
          </button>
        </div>
      </section>

      <!-- Acciones principales -->
      <section class="action-buttons">
        <button class="btn-secondary" @click="solicitarAutenticacion('editar')">
          Editar perfil
        </button>
        <button class="btn-peligro" @click="solicitarAutenticacion('eliminar')">
          Borrar usuario
        </button>
        <button class="btn-peligro" @click="handleLogout">
          Cerrar sesión
        </button>
      </section>
    </section>

    <!-- ========== VERIFICACIÓN DE CONTRASEÑA ========== -->
    <section v-if="seccionActiva === 'verificar'" class="card">
      <h3>Verificación de seguridad</h3>
      <p class="subtitulo">Para continuar, confirma tu contraseña actual</p>

      <div v-if="errorVerificacion" class="mensaje-error">{{ errorVerificacion }}</div>

      <form @submit.prevent="verificarPassword" class="form-usuario">
        <div class="form-group">
          <label for="passwordConfirmacion">Contraseña actual</label>
          <input
            type="password"
            id="passwordConfirmacion"
            v-model="passwordConfirmacion"
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="verificando">
            <span v-if="verificando">Verificando...</span>
            <span v-else>Confirmar</span>
          </button>
          <button type="button" class="btn-ghost" @click="cancelarAccion">Cancelar</button>
        </div>
      </form>
    </section>

    <!-- ========== CAMBIAR CONTRASEÑA ========== -->
    <section v-if="seccionActiva === 'cambiarPassword'" class="card">
      <h3>Cambiar contraseña</h3>

      <div v-if="mensajeCambioPassword" :class="['mensaje', mensajeCambioPasswordTipo]">
        {{ mensajeCambioPassword }}
      </div>

      <form @submit.prevent="cambiarPassword" class="form-usuario">
        <div class="form-group">
          <label for="nuevaPassword">Nueva contraseña</label>
          <input
            type="password"
            id="nuevaPassword"
            v-model="nuevaPassword"
            placeholder="Ingresa tu nueva contraseña"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmarPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmarPassword"
            v-model="confirmarPassword"
            placeholder="Repite tu nueva contraseña"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            <span v-if="guardando">Actualizando...</span>
            <span v-else>Actualizar contraseña</span>
          </button>
          <button type="button" class="btn-ghost" @click="cancelarAccion">Cancelar</button>
        </div>
      </form>
    </section>

    <!-- ========== EDITAR USUARIO ========== -->
    <section v-if="seccionActiva === 'editar'" class="card">
      <h3>Editar perfil</h3>

      <div v-if="mensajeEdicion" :class="['mensaje', mensajeEdicionTipo]">
        {{ mensajeEdicion }}
      </div>

      <form @submit.prevent="guardarEdicion" class="form-usuario">
        <div class="form-group">
          <label for="editarNombre">Nombre</label>
          <input
            type="text"
            id="editarNombre"
            v-model="formEdicion.nombreCuenta"
            placeholder="Nombre completo"
            required
          />
        </div>

        <div class="form-group">
          <label for="editarCorreo">Correo</label>
          <input
            type="email"
            id="editarCorreo"
            v-model="formEdicion.correo"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="editarContrasena">Contraseña</label>
          <input
            type="password"
            id="editarContrasena"
            v-model="formEdicion.contrasena"
            placeholder="Contraseña actual"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            <span v-if="guardando">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
          <button type="button" class="btn-ghost" @click="cancelarAccion">Cancelar</button>
        </div>
      </form>
    </section>

    <!-- ========== ELIMINAR CUENTA ========== -->
    <section v-if="seccionActiva === 'eliminar'" class="card card-peligro">
      <h3>Eliminar cuenta</h3>

      <p class="warning-text">
        <strong>Advertencia:</strong> Esta acción es permanente y no se puede deshacer.
        Se eliminarán todos tus datos del sistema.
      </p>

      <div class="form-actions">
        <button class="btn-peligro" @click="confirmarEliminacion" :disabled="eliminando">
          <span v-if="eliminando">Eliminando...</span>
          <span v-else>Eliminar definitivamente</span>
        </button>
        <button class="btn-ghost" @click="cancelarAccion">Cancelar</button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const authStore = useAuthStore();

// ── Estado de la vista ─────────────────────────────────────────
const seccionActiva = ref('perfil');
const accionPendiente = ref(null);

// ── Datos del usuario ──────────────────────────────────────────
const usuario = reactive({ nombreCuenta: '', correo: '' });
const cargando = ref(true);

// ── Estados de formularios ─────────────────────────────────────
const passwordConfirmacion = ref('');
const verificando = ref(false);
const errorVerificacion = ref('');

const nuevaPassword = ref('');
const confirmarPassword = ref('');
const mensajeCambioPassword = ref('');
const mensajeCambioPasswordTipo = ref('');

const formEdicion = reactive({ nombreCuenta: '', correo: '', contrasena: '' });
const mensajeEdicion = ref('');
const mensajeEdicionTipo = ref('');

const guardando = ref(false);
const eliminando = ref(false);

// ── ID del usuario autenticado ─────────────────────────────────
const idUsr = authStore.user?.idUsuario;

// ══════════════════════════════════════════════════════════════
//  CARGAR USUARIO  (GET /usuario/{id})
// ══════════════════════════════════════════════════════════════
async function cargarUsuario() {
  if (!idUsr) {
    router.push('/login');
    return;
  }
  cargando.value = true;
  try {
    const { data } = await api.get(`/usuario/${idUsr}`);

    if (!data || !data.nombreCuenta || !data.correo) {
      throw new Error('Datos de usuario incompletos');
    }

    usuario.nombreCuenta = data.nombreCuenta;
    usuario.correo       = data.correo;
  } catch (error) {
    console.error('Error al cargar usuario:', error);
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarUsuario);

// ══════════════════════════════════════════════════════════════
//  CONTROL DE SECCIONES
// ══════════════════════════════════════════════════════════════
function solicitarAutenticacion(accion) {
  accionPendiente.value = accion;
  passwordConfirmacion.value = '';
  errorVerificacion.value = '';
  seccionActiva.value = 'verificar';
}

function cancelarAccion() {
  accionPendiente.value = null;
  seccionActiva.value = 'perfil';
}

// ══════════════════════════════════════════════════════════════
//  VERIFICAR CONTRASEÑA  (PUT /usuario/{id}/password)
//  El JS original envía { passwordActual, passwordNueva: mismo }
//  para validar sin cambiar nada.
// ══════════════════════════════════════════════════════════════
async function verificarPassword() {
  if (!passwordConfirmacion.value) {
    errorVerificacion.value = 'Debes ingresar tu contraseña';
    return;
  }
  verificando.value = true;
  errorVerificacion.value = '';

  try {
    const response = await api.put(`/usuario/${idUsr}/password`, {
      passwordActual: passwordConfirmacion.value,
      passwordNueva:  passwordConfirmacion.value   // mismo valor = solo verificar
    });

    // 204 o 2xx → contraseña válida
    switch (accionPendiente.value) {
      case 'password':
        nuevaPassword.value   = '';
        confirmarPassword.value = '';
        mensajeCambioPassword.value = '';
        seccionActiva.value = 'cambiarPassword';
        break;
      case 'editar':
        formEdicion.nombreCuenta = usuario.nombreCuenta;
        formEdicion.correo       = usuario.correo;
        formEdicion.contrasena   = passwordConfirmacion.value;
        mensajeEdicion.value = '';
        seccionActiva.value = 'editar';
        break;
      case 'eliminar':
        seccionActiva.value = 'eliminar';
        break;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      errorVerificacion.value = 'Contraseña incorrecta';
    } else {
      errorVerificacion.value = 'Error de verificación. Inténtalo de nuevo.';
    }
  } finally {
    verificando.value = false;
  }
}

// ══════════════════════════════════════════════════════════════
//  CAMBIAR CONTRASEÑA  (PUT /usuario/{id}/password)
//  JSON: { passwordActual, passwordNueva }
// ══════════════════════════════════════════════════════════════
async function cambiarPassword() {
  if (nuevaPassword.value !== confirmarPassword.value) {
    mensajeCambioPassword.value = 'Las contraseñas no coinciden';
    mensajeCambioPasswordTipo.value = 'mensaje-error';
    return;
  }
  guardando.value = true;
  mensajeCambioPassword.value = '';

  try {
    await api.put(`/usuario/${idUsr}/password`, {
      passwordActual: passwordConfirmacion.value,
      passwordNueva:  nuevaPassword.value
    });
    mensajeCambioPassword.value = 'Contraseña actualizada correctamente';
    mensajeCambioPasswordTipo.value = 'mensaje-exito';
    setTimeout(() => cancelarAccion(), 1500);
  } catch (error) {
    if (error.response?.status === 401) {
      mensajeCambioPassword.value = 'Contraseña actual incorrecta';
    } else {
      mensajeCambioPassword.value = 'Error al actualizar contraseña';
    }
    mensajeCambioPasswordTipo.value = 'mensaje-error';
  } finally {
    guardando.value = false;
  }
}

// ══════════════════════════════════════════════════════════════
//  EDITAR USUARIO  (PUT /usuario/{id})
//  JSON: { nombreCuenta, correo, contrasena, idRol: 3 }
// ══════════════════════════════════════════════════════════════
async function guardarEdicion() {
  guardando.value = true;
  mensajeEdicion.value = '';

  try {
    await api.put(`/usuario/${idUsr}`, {
      nombreCuenta: formEdicion.nombreCuenta,
      correo:       formEdicion.correo,
      contrasena:   formEdicion.contrasena,
      idRol:        3
    });

    mensajeEdicion.value = '✅ Perfil actualizado correctamente';
    mensajeEdicionTipo.value = 'mensaje-exito';

    // Actualizar datos mostrados y store
    usuario.nombreCuenta = formEdicion.nombreCuenta;
    usuario.correo       = formEdicion.correo;
    authStore.user.nombreCuenta = formEdicion.nombreCuenta;

    setTimeout(() => cancelarAccion(), 1500);
  } catch (error) {
    mensajeEdicion.value = 'Error al actualizar perfil';
    mensajeEdicionTipo.value = 'mensaje-error';
  } finally {
    guardando.value = false;
  }
}

// ══════════════════════════════════════════════════════════════
//  ELIMINAR CUENTA  (DELETE /usuario/{id})
// ══════════════════════════════════════════════════════════════
async function confirmarEliminacion() {
  const confirmado = confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  eliminando.value = true;

  try {
    await api.delete(`/usuario/${idUsr}`);
    authStore.logout();
    router.push('/smartlearn');
  } catch (error) {
    alert('Error al eliminar la cuenta. Inténtalo de nuevo.');
  } finally {
    eliminando.value = false;
  }
}

// ══════════════════════════════════════════════════════════════
//  CERRAR SESIÓN
// ══════════════════════════════════════════════════════════════
function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.usuario-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Card base ── */
.card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #edf2f7;
}

.card-peligro {
  border-left: 4px solid #e53e3e;
}

/* ── Perfil ── */
.perfil-card {
  text-align: center;
}

.perfil-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.img-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4a90e2;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.perfil-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.info-usr {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.campo {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.valor {
  color: #2d3748;
  font-weight: 500;
}

.perfil-acciones {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 20px;
  border-top: 1px solid #edf2f7;
}

/* ── Formulario ── */
.form-usuario {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  background: #f7fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
  background: #fff;
}

.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── Botones ── */
.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 20px;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-peligro {
  padding: 10px 20px;
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-peligro:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-peligro:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost {
  padding: 10px 20px;
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: #f7fafc;
  color: #2d3748;
}

/* ── Mensajes ── */
.mensaje-error {
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.mensaje-exito {
  background: #f0fff4;
  color: #276749;
  border: 1px solid #9ae6b4;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.warning-text {
  background: #fffbeb;
  border: 1px solid #f6e05e;
  color: #744210;
  padding: 14px;
  border-radius: 8px;
  margin: 12px 0 20px;
  font-size: 0.95rem;
}

/* ── Subtítulos ── */
.subtitulo {
  color: #718096;
  margin: 0 0 4px;
  font-size: 0.95rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px;
}

/* ── Loading ── */
.estado-carga {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #718096;
  justify-content: center;
  padding: 20px 0;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
