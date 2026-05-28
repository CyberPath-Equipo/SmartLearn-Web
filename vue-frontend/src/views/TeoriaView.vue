<template>
  <div class="content-view">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-item">Inicio</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link to="/materias" class="breadcrumb-item">Materias</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link
        v-if="materia.id"
        :to="{ name: 'tema', params: { idMateria: materia.id, nombreMateria: materia.nombre } }"
        class="breadcrumb-item"
      >
        {{ materia.nombre }}
      </router-link>
      <span v-else class="breadcrumb-item">Materia</span>
      <span class="breadcrumb-separator">/</span>
      <router-link
        v-if="tema.id"
        :to="{ name: 'subtema', params: { idTema: tema.id, nombreTema: tema.nombre } }"
        class="breadcrumb-item"
      >
        {{ tema.nombre }}
      </router-link>
      <span v-else class="breadcrumb-item">Tema</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{ nombreSubtema }}</span>
    </div>

    <!-- Header del Subtema Activo (con acciones de Editar/Eliminar Subtema) -->
    <div class="subtema-header-card animate-slide-up">
      <div class="subtema-info">
        <span class="subtema-badge">Subtema Activo</span>
        <h2 class="subtema-title">{{ subtema.nombre || nombreSubtema }}</h2>
        <p class="subtema-desc">Visualiza y gestiona la teoría y los ejercicios prácticos de este bloque.</p>
      </div>
      <div class="subtema-actions">
        <button class="btn-action-edit" @click="mostrarFormEditSubtema">
          <span class="btn-icon">✏️</span> Editar Subtema
        </button>
        <button class="btn-action-delete" @click="eliminarSubtemaActivo">
          <span class="btn-icon">🗑️</span> Eliminar Subtema
        </button>
      </div>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- Modal: Editar Subtema -->
    <div v-if="formEditSubtemaVisible" class="modal-overlay" @click.self="ocultarFormEditSubtema">
      <div class="modal-card animate-slide-up">
        <div class="modal-header">
          <h3>Editar Subtema</h3>
          <button class="btn-close" @click="ocultarFormEditSubtema">&times;</button>
        </div>
        <form @submit.prevent="guardarEdicionSubtema" class="form-grid">
          <div class="form-group">
            <label for="editSubtemaNombre">Nombre del Subtema</label>
            <input id="editSubtemaNombre" type="text" v-model="formEditSubtema.nombre" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary-blue" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button type="button" class="btn-secondary" @click="ocultarFormEditSubtema">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Contenedor Principal de Teoría y Ejercicios -->
    <div class="main-split-container" v-if="estado !== 'consultando'">
      
      <!-- ==================== SECCIÓN TEORÍA ==================== -->
      <div class="teoria-section">
        <!-- Estado: Crear Teoría -->
        <div v-if="estado === 'crear'" class="card no-theory-card animate-slide-up">
          <div class="no-theory-icon">📖</div>
          <h3>Sin Teoría Registrada</h3>
          <p>Este subtema aún no cuenta con material pedagógico. Agrega teoría para guiar a tus alumnos.</p>
          <button class="btn-primary-blue" @click="mostrarCrearTeoriaForm">
            + Redactar Teoría
          </button>
        </div>

        <!-- Formulario Crear/Editar Teoría -->
        <div v-else-if="estado === 'form-crear' || estado === 'editar'" class="card teoria-form-card animate-slide-up">
          <h3>{{ estado === 'editar' ? 'Editar Teoría' : 'Nueva Teoría' }}</h3>
          <form @submit.prevent="estado === 'editar' ? actualizarTeoria() : guardarTeoria()" class="form-grid">
            <div class="form-group">
              <label for="tituloTeoria">Título del Bloque Teórico</label>
              <input type="text" id="tituloTeoria" v-model="formTeoria.titulo" placeholder="Ej. Fundamentos de las variables" required />
            </div>
            <div class="form-group">
              <label for="contenidoTeoria">Contenido Pedagógico</label>
              <textarea id="contenidoTeoria" v-model="formTeoria.contenido" rows="12" placeholder="Escribe la explicación detallada aquí..." required></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary-blue" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar Teoría' }}
              </button>
              <button type="button" class="btn-secondary" @click="cancelarEdicionTeoria">Cancelar</button>
            </div>
          </form>
        </div>

        <!-- Visualización de Teoría -->
        <div v-else-if="estado === 'ver'" class="card teoria-display-card animate-slide-up">
          <div class="teoria-display-header">
            <div>
              <span class="section-tag">Contenido de Lectura</span>
              <h3 class="teoria-display-title">{{ teoria.titulo || 'Teoría del Subtema' }}</h3>
            </div>
            <div class="teoria-display-actions">
              <button class="btn-action-edit btn-sm" @click="prepararEdicion">
                ✏️ Editar
              </button>
              <button class="btn-action-delete btn-sm" @click="eliminarTeoria">
                🗑️ Eliminar
              </button>
            </div>
          </div>
          <div class="teoria-display-body">
            <p v-for="(parrafo, index) in parrafosTeoria" :key="index" class="teoria-paragraph">
              {{ parrafo }}
            </p>
          </div>
        </div>
      </div>

      <!-- ==================== SECCIÓN EJERCICIOS ==================== -->
      <div class="ejercicios-section">
        <div class="ejercicios-header-bar">
          <div>
            <h3 class="section-title-ej">Ejercicios Prácticos</h3>
            <p class="section-subtitle-ej">Evaluaciones y actividades asociadas.</p>
          </div>
          <button class="btn-primary-blue btn-sm-pad" @click="irACrearEjercicio">
            + Crear Ejercicio
          </button>
        </div>

        <div v-if="cargandoEjercicios" class="estado-carga">
          <div class="spinner"></div>
          <p>Cargando ejercicios...</p>
        </div>

        <div v-else class="ejercicios-grid">
          <div v-if="ejercicios.length === 0" class="no-data-card-small">
            <p>No hay ejercicios creados para este subtema.</p>
          </div>

          <div
            v-else
            v-for="(ejercicio, idx) in ejercicios"
            :key="ejercicio.id"
            class="ejercicio-card animate-slide-up"
            :style="{ borderLeft: `5px solid ${getBorderColor(idx)}` }"
            @click="irAVerEjercicio(ejercicio)"
          >
            <div class="ejercicio-card-info">
              <span class="ejercicio-icon-badge">📝</span>
              <div>
                <h4 class="ejercicio-title">{{ ejercicio.nombre }}</h4>
              </div>
            </div>
            <span class="ejercicio-arrow-link">Gestionar &rarr;</span>
          </div>
        </div>
      </div>
      
    </div>

    <!-- Cargando general -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando información del subtema...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

const idSubtema = route.params.idSubtema;
const nombreSubtema = route.params.nombreSubtema;

// Estado
const estado = ref('consultando'); // 'consultando', 'crear', 'form-crear', 'ver', 'editar'
const subtema = ref({ id: idSubtema, nombre: nombreSubtema, idTema: null });
const tema = ref({ id: null, nombre: '', idMateria: null });
const materia = ref({ id: null, nombre: '' });

const teoria = reactive({ id: null, titulo: '', contenido: '' });
const ejercicios = ref([]);
const cargando = ref(true);
const cargandoEjercicios = ref(false);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const formEditSubtemaVisible = ref(false);
const formEditSubtema = reactive({ nombre: '' });

const formTeoria = reactive({ titulo: '', contenido: '' });

const parrafosTeoria = computed(() => {
  if (!teoria.contenido) return [];
  return teoria.contenido.split('\n').filter(p => p.trim() !== '');
});

const colors = ['#2563eb', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];
function getBorderColor(idx) {
  return colors[idx % colors.length];
}

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar jerarquía de padres para breadcrumbs
async function cargarDatosPadres() {
  try {
    const { data: datosSubtema } = await api.get(`/subtema/${idSubtema}`);
    if (datosSubtema) {
      subtema.value = datosSubtema;
      if (datosSubtema.idTema) {
        const { data: datosTema } = await api.get(`/tema/${datosSubtema.idTema}`);
        if (datosTema) {
          tema.value = datosTema;
          if (datosTema.idMateria) {
            const { data: datosMateria } = await api.get(`/materia/${datosTema.idMateria}`);
            if (datosMateria) {
              materia.value = datosMateria;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error al cargar datos jerárquicos:', error);
  }
}

// Cargar teoría: GET /subtema/{idSubtema}/teoria
async function cargarTeoria() {
  if (!idSubtema) { router.back(); return; }
  cargando.value = true;
  try {
    const { data } = await api.get(`/subtema/${idSubtema}/teoria`);
    if (data) {
      teoria.id = data.id;
      teoria.titulo = data.titulo;
      teoria.contenido = data.contenido;
      estado.value = 'ver';
      cargarEjercicios();
    } else {
      estado.value = 'crear';
    }
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 204) {
      estado.value = 'crear';
    } else {
      mostrarMensaje('Error cargando teoría', 'error');
    }
  } finally {
    cargando.value = false;
  }
}

// Cargar ejercicios: GET /subtema/{idSubtema}/ejercicios
async function cargarEjercicios() {
  cargandoEjercicios.value = true;
  try {
    const { data } = await api.get(`/subtema/${idSubtema}/ejercicios`);
    ejercicios.value = Array.isArray(data) ? data : [];
  } catch (error) {
    ejercicios.value = [];
  } finally {
    cargandoEjercicios.value = false;
  }
}

onMounted(() => {
  cargarDatosPadres();
  cargarTeoria();
});

// Modales y formularios de teoría
function mostrarFormEditSubtema() {
  formEditSubtema.nombre = subtema.value.nombre;
  formEditSubtemaVisible.value = true;
}
function ocultarFormEditSubtema() { formEditSubtemaVisible.value = false; }

function mostrarCrearTeoriaForm() {
  formTeoria.titulo = '';
  formTeoria.contenido = '';
  estado.value = 'form-crear';
}

function cancelarEdicionTeoria() {
  if (teoria.id) {
    estado.value = 'ver';
  } else {
    estado.value = 'crear';
  }
}

// Guardar teoría (Crear): POST /teoria/docente
async function guardarTeoria() {
  guardando.value = true;
  try {
    const { data } = await api.post('/teoria/docente', {
      idSubtema: parseInt(idSubtema),
      titulo: formTeoria.titulo,
      contenido: formTeoria.contenido
    });
    teoria.id = data.id;
    teoria.titulo = data.titulo;
    teoria.contenido = data.contenido;
    estado.value = 'ver';
    mostrarMensaje('Teoría creada correctamente');
    cargarEjercicios();
  } catch {
    mostrarMensaje('Error al crear la teoría', 'error');
  } finally {
    guardando.value = false;
  }
}

// Preparar edición de teoría
function prepararEdicion() {
  formTeoria.titulo = teoria.titulo;
  formTeoria.contenido = teoria.contenido;
  estado.value = 'editar';
}

// Actualizar teoría (Editar): PUT /teoria/{id}
async function actualizarTeoria() {
  guardando.value = true;
  try {
    const { data } = await api.put(`/teoria/${teoria.id}`, {
      idSubtema: parseInt(idSubtema),
      titulo: formTeoria.titulo,
      contenido: formTeoria.contenido
    });
    teoria.titulo = data.titulo;
    teoria.contenido = data.contenido;
    estado.value = 'ver';
    mostrarMensaje('Teoría actualizada');
  } catch {
    mostrarMensaje('Error al actualizar la teoría', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar teoría: DELETE /subtema/teoria/{idTeoria}
async function eliminarTeoria() {
  if (!confirm('¿Deseas eliminar esta teoría?')) return;
  try {
    await api.delete(`/subtema/teoria/${teoria.id}`);
    mostrarMensaje('Teoría eliminada');
    teoria.id = null;
    teoria.titulo = '';
    teoria.contenido = '';
    estado.value = 'crear';
  } catch {
    mostrarMensaje('No se pudo eliminar la teoría', 'error');
  }
}

// Guardar Edición de Subtema
async function guardarEdicionSubtema() {
  if (!formEditSubtema.nombre.trim()) return;
  guardando.value = true;
  try {
    const { data } = await api.put(`/subtema/${idSubtema}`, {
      nombre: formEditSubtema.nombre.trim(),
      idTema: subtema.value.idTema || tema.value.id
    });
    subtema.value.nombre = data.nombre;
    mostrarMensaje('Subtema actualizado');
    ocultarFormEditSubtema();
  } catch {
    mostrarMensaje('Error al actualizar el subtema', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar Subtema
async function eliminarSubtemaActivo() {
  if (!confirm('¿Seguro que deseas eliminar este subtema? Se borrarán sus contenidos asociados.')) return;
  try {
    await api.delete(`/subtema/${idSubtema}`);
    mostrarMensaje('Subtema eliminado');
    router.push({
      name: 'subtema',
      params: {
        idTema: tema.value.id || subtema.value.idTema,
        nombreTema: tema.value.nombre || 'Tema'
      }
    });
  } catch {
    mostrarMensaje('Error al eliminar el subtema', 'error');
  }
}

// Navegación
function irACrearEjercicio() {
  router.push({ name: 'crear-ejercicio', query: { idSubtema, nombreSubtema } });
}

function irAVerEjercicio(ejercicio) {
  router.push({
    name: 'ejercicio',
    query: { idEjercicio: ejercicio.id, idSubtema, nombreSubtema }
  });
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

/* Header del Subtema */
.subtema-header-card {
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

.subtema-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 70%;
}

.subtema-badge {
  align-self: flex-start;
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.subtema-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
  letter-spacing: -0.025em;
}

.subtema-desc {
  font-size: 0.98rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.subtema-actions {
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

.btn-action-edit.btn-sm, .btn-action-delete.btn-sm {
  padding: 6px 12px;
  font-size: 0.825rem;
  width: auto;
}

/* Split Layout */
.main-split-container {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.teoria-section {
  flex: 3;
  min-width: 0;
}

.ejercicios-section {
  flex: 2;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

@media (max-width: 992px) {
  .main-split-container {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Tarjeta Teoría */
.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 32px;
}

.no-theory-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 40px;
}

.no-theory-icon {
  font-size: 3rem;
}

.no-theory-card h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #1a202c;
}

.no-theory-card p {
  margin: 0;
  color: #718096;
  max-width: 320px;
  line-height: 1.6;
}

.teoria-form-card h3 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  color: #1a202c;
}

/* Lectura de teoría */
.teoria-display-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.teoria-display-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 20px;
  gap: 16px;
}

.section-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.teoria-display-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 8px 0 0 0;
  letter-spacing: -0.015em;
}

.teoria-display-actions {
  display: flex;
  gap: 8px;
}

.teoria-display-body {
  font-size: 1.05rem;
  color: #2d3748;
  line-height: 1.8;
}

.teoria-paragraph {
  margin: 0 0 16px 0;
}
.teoria-paragraph:last-child {
  margin: 0;
}

/* Ejercicios Section Header */
.ejercicios-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.section-title-ej {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.section-subtitle-ej {
  font-size: 0.825rem;
  color: #718096;
  margin: 2px 0 0 0;
}

.btn-sm-pad {
  padding: 8px 14px;
  font-size: 0.85rem;
  border-radius: 8px;
}

/* Grid de ejercicios */
.ejercicios-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ejercicio-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.ejercicio-card:hover {
  background: #ffffff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.ejercicio-card-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ejercicio-icon-badge {
  font-size: 1.3rem;
}

.ejercicio-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 2px 0;
}

.ejercicio-arrow-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #718096;
  transition: transform 0.2s, color 0.2s;
}

.ejercicio-card:hover .ejercicio-arrow-link {
  transform: translateX(4px);
  color: #2563eb;
}

.no-data-card-small {
  background: #f7fafc;
  border: 1px dashed #e2e8f0;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
}

/* Formulario */
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
.btn-primary-blue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modales */
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

/* Cargando */
.estado-carga {
  padding: 40px;
  text-align: center;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
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
