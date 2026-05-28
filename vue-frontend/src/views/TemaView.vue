<template>
  <div class="content-view">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-item">Inicio</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link to="/materias" class="breadcrumb-item">Materias</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{ nombreMateria }}</span>
    </div>

    <!-- Header de la Materia Activa (con sus acciones de Editar/Eliminar) -->
    <div class="materia-header-card animate-slide-up">
      <div class="materia-info">
        <span class="materia-badge">Materia Seleccionada</span>
        <h2 class="materia-title">{{ materia.nombre || nombreMateria }}</h2>
        <p class="materia-desc">{{ materia.descripcion || 'Sin descripción disponible para esta materia.' }}</p>
      </div>
      <div class="materia-actions">
        <button class="btn-action-edit" @click="mostrarFormEditMateria">
          <span class="btn-icon">✏️</span> Editar Materia
        </button>
        <button class="btn-action-delete" @click="eliminarMateriaActiva">
          <span class="btn-icon">🗑️</span> Eliminar Materia
        </button>
      </div>
    </div>

    <!-- Topbar para Temas -->
    <div class="topbar">
      <div>
        <h3 class="section-title">Temas de la Materia</h3>
        <p class="section-subtitle">Selecciona un tema para ver sus subtemas o agrega uno nuevo.</p>
      </div>
      <button class="btn-primary-blue" @click="mostrarFormAdd">
        <span class="btn-icon">+</span> Nuevo Tema
      </button>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- Modal: Editar Materia -->
    <div v-if="formEditMateriaVisible" class="modal-overlay" @click.self="ocultarFormEditMateria">
      <div class="modal-card animate-slide-up">
        <div class="modal-header">
          <h3>Editar Materia</h3>
          <button class="btn-close" @click="ocultarFormEditMateria">&times;</button>
        </div>
        <form @submit.prevent="guardarEdicionMateria" class="form-grid">
          <div class="form-group">
            <label for="editMateriaNombre">Nombre de la Materia</label>
            <input id="editMateriaNombre" type="text" v-model="formEditMateria.nombre" required />
          </div>
          <div class="form-group">
            <label for="editMateriaDesc">Descripción</label>
            <textarea id="editMateriaDesc" v-model="formEditMateria.descripcion" rows="3" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary-blue" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button type="button" class="btn-secondary" @click="ocultarFormEditMateria">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Crear Tema -->
    <div v-if="formAddVisible" class="modal-overlay" @click.self="ocultarFormAdd">
      <div class="modal-card animate-slide-up">
        <div class="modal-header">
          <h3>Nuevo Tema</h3>
          <button class="btn-close" @click="ocultarFormAdd">&times;</button>
        </div>
        <form @submit.prevent="crearTema" class="form-grid">
          <div class="form-group">
            <label for="nombreTema">Nombre del Tema</label>
            <input id="nombreTema" type="text" v-model="formAdd.nombre" placeholder="Ej. Introducción al álgebra" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary-blue" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Crear Tema' }}
            </button>
            <button type="button" class="btn-secondary" @click="ocultarFormAdd">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Grid de Temas -->
    <div class="cards-grid">
      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando temas...</p>
      </div>

      <template v-else>
        <div v-if="temas.length === 0" class="no-data-card">
          <p class="sin-datos">No hay temas registrados para esta materia. ¡Comienza creando uno!</p>
        </div>

        <div
          v-else
          v-for="(tema, index) in temas"
          :key="tema.id"
          class="tema-card"
          :style="{ background: getGradient(index) }"
          @click="irASubtemas(tema)"
        >
          <div class="tema-card-content">
            <h4 class="tema-title">{{ tema.nombre }}</h4>
          </div>
          <div class="tema-card-footer">

            <span class="tema-action-link">Ver Subtemas &rarr;</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

// Parámetros de la materia padre
const idMateria = route.params.idMateria;
const nombreMateria = route.params.nombreMateria;

// Estado
const materia = ref({ id: idMateria, nombre: nombreMateria, descripcion: '' });
const temas = ref([]);
const cargando = ref(true);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const formAddVisible = ref(false);
const formAdd = reactive({ nombre: '' });

const formEditMateriaVisible = ref(false);
const formEditMateria = reactive({ nombre: '', descripcion: '' });

const gradients = [
  'linear-gradient(135deg, #6366f1, #4f46e5)', // Indigo
  'linear-gradient(135deg, #0ea5e9, #2563eb)', // Sky/Blue
  'linear-gradient(135deg, #10b981, #059669)', // Emerald
  'linear-gradient(135deg, #ec4899, #db2777)', // Pink
  'linear-gradient(135deg, #f59e0b, #d97706)', // Amber
  'linear-gradient(135deg, #06b6d4, #0891b2)', // Cyan
];

function getGradient(index) {
  return gradients[index % gradients.length];
}

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar detalles de la materia
async function cargarMateriaDetalles() {
  try {
    const { data } = await api.get(`/materia/${idMateria}`);
    if (data) {
      materia.value = data;
    }
  } catch (error) {
    console.error('Error al cargar detalles de la materia:', error);
  }
}

// Cargar temas: GET /materia/{idMateria}/temas
async function cargarTemas() {
  if (!idMateria) { router.push('/materias'); return; }
  cargando.value = true;
  try {
    const { data } = await api.get(`/materia/${idMateria}/temas`);
    temas.value = data;
  } catch (error) {
    if (error.response?.status === 404) {
      temas.value = [];
    } else {
      mostrarMensaje('Error de conexión con el servidor', 'error');
    }
  } finally {
    cargando.value = false;
  }
}

onMounted(() => {
  cargarMateriaDetalles();
  cargarTemas();
});

// Modales
function mostrarFormAdd() {
  formAdd.nombre = '';
  formAddVisible.value = true;
}
function ocultarFormAdd() { formAddVisible.value = false; }

function mostrarFormEditMateria() {
  formEditMateria.nombre = materia.value.nombre;
  formEditMateria.descripcion = materia.value.descripcion ?? '';
  formEditMateriaVisible.value = true;
}
function ocultarFormEditMateria() { formEditMateriaVisible.value = false; }

// Crear Tema: POST /tema
async function crearTema() {
  if (!formAdd.nombre.trim()) return;
  guardando.value = true;
  try {
    await api.post('/tema', {
      nombre: formAdd.nombre,
      idMateria: parseInt(idMateria)
    });
    mostrarMensaje('Tema creado correctamente');
    ocultarFormAdd();
    await cargarTemas();
  } catch {
    mostrarMensaje('Error al guardar el tema', 'error');
  } finally {
    guardando.value = false;
  }
}

// Guardar Edición de Materia: PUT /materia/{id}
async function guardarEdicionMateria() {
  if (!formEditMateria.nombre.trim()) return;
  guardando.value = true;
  try {
    const { data } = await api.put(`/materia/${idMateria}`, {
      nombre: formEditMateria.nombre.trim(),
      descripcion: formEditMateria.descripcion.trim()
    });
    materia.value = data;
    mostrarMensaje('Materia actualizada correctamente');
    ocultarFormEditMateria();
  } catch {
    mostrarMensaje('Error al actualizar la materia', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar Materia: DELETE /materia/{id}
async function eliminarMateriaActiva() {
  if (!confirm('¿Seguro que deseas eliminar esta materia? Se eliminarán todos sus temas y subtemas.')) return;
  try {
    await api.delete(`/materia/${idMateria}`);
    mostrarMensaje('Materia eliminada correctamente');
    router.push('/materias');
  } catch {
    mostrarMensaje('Error al eliminar la materia', 'error');
  }
}

// Navegar a subtemas del tema seleccionado
function irASubtemas(tema) {
  router.push({ name: 'subtema', params: { idTema: tema.id, nombreTema: tema.nombre } });
}
</script>

<style scoped>
/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 12px;
}
.breadcrumb-item {
  text-decoration: none;
  color: #718096;
  transition: color 0.2s;
}
.breadcrumb-item:hover:not(.active) {
  color: #2b6cb0;
}
.breadcrumb-item.active {
  color: #2d3748;
  font-weight: 500;
}
.breadcrumb-separator {
  color: #cbd5e0;
}

/* Layout principal */
.content-view {
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Tarjeta del header de la Materia */
.materia-header-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.materia-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 70%;
}

.materia-badge {
  align-self: flex-start;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.materia-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
  letter-spacing: -0.025em;
}

.materia-desc {
  font-size: 0.98rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.materia-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
}

.btn-action-edit, .btn-action-delete {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s, color 0.2s;
  width: 100%;
}

.btn-action-edit {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}
.btn-action-edit:hover {
  background: #edf2f7;
  color: #1a202c;
}

.btn-action-delete {
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}
.btn-action-delete:hover {
  background: #fed7d7;
  color: #9b2c2c;
}

/* Secciones de temas */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 12px;
  border-top: 1px solid #edf2f7;
  padding-top: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}

/* Botón azul principal */
.btn-primary-blue {
  padding: 11px 22px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary-blue:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}
.btn-primary-blue:active {
  transform: translateY(1px);
}
.btn-primary-blue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-close:hover {
  color: #4a5568;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.form-group input, .form-group textarea {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #2d3748;
  background: #f7fafc;
  transition: border-color 0.2s, background-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-secondary {
  padding: 11px 22px;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover {
  background: #e2e8f0;
}

/* Grid de tarjetas de temas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.tema-card {
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  cursor: pointer;
  color: #ffffff;
  box-shadow: 0 8px 12px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, filter 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.tema-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tema-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 20px -5px rgba(0, 0, 0, 0.12);
  filter: brightness(1.05);
}

.tema-card:hover::before {
  opacity: 1;
}

.tema-card-content {
  z-index: 1;
}

.tema-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.tema-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.95;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
}

.tema-action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s;
}

.tema-card:hover .tema-action-link {
  transform: translateX(4px);
}

/* Mensajes */
.mensaje-estado {
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}
.msg-exito {
  background: #f0fff4;
  color: #1c6239;
  border: 1px solid #c6f6d5;
}
.msg-error {
  background: #fff5f5;
  color: #9b2c2c;
  border: 1px solid #fed7d7;
}

/* Carga */
.estado-carga {
  grid-column: 1 / -1;
  padding: 50px;
  text-align: center;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

.no-data-card {
  grid-column: 1 / -1;
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
}

.sin-datos {
  color: #718096;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
