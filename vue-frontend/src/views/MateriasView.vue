<template>
  <div class="content-view">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-item">Inicio</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Materias</span>
    </div>

    <!-- Topbar -->
    <div class="topbar">
      <div>
        <h2 class="view-title">Materias Disponibles</h2>
        <p class="view-subtitle">Explora tus materias y gestiona sus contenidos académicos.</p>
      </div>
      <button class="btn-primary-blue" @click="mostrarFormAdd">
        <span class="btn-icon">+</span> Nueva materia
      </button>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- Modal/Formulario Flotante: Crear Materia -->
    <div v-if="formAddVisible" class="modal-overlay" @click.self="ocultarFormAdd">
      <div class="modal-card animate-slide-up">
        <div class="modal-header">
          <h3>Nueva Materia</h3>
          <button class="btn-close" @click="ocultarFormAdd">&times;</button>
        </div>
        <form @submit.prevent="crearMateria" class="form-grid">
          <div class="form-group">
            <label for="nombreMateria">Nombre de la Materia</label>
            <input id="nombreMateria" type="text" v-model="formAdd.nombre" placeholder="Ej. Matemáticas I" required />
          </div>
          <div class="form-group">
            <label for="descripcionMateria">Descripción</label>
            <textarea id="descripcionMateria" v-model="formAdd.descripcion" placeholder="Ej. Curso introductorio de álgebra y geometría" rows="3" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary-blue" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Crear Materia' }}
            </button>
            <button type="button" class="btn-secondary" @click="ocultarFormAdd">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Grid de Materias -->
    <div class="cards-grid">
      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando materias...</p>
      </div>
      
      <template v-else>
        <div v-if="materias.length === 0" class="no-data-card">
          <p class="sin-datos">No hay materias registradas. ¡Comienza creando una nueva!</p>
        </div>

        <div
          v-else
          v-for="(materia, index) in materias"
          :key="materia.id"
          class="materia-card"
          :style="{ background: getGradient(index) }"
          @click="irATemas(materia)"
        >
          <div class="materia-card-content">
            <h3 class="materia-title">{{ materia.nombre }}</h3>
            <p class="materia-desc">{{ materia.descripcion ?? 'Sin descripción disponible' }}</p>
          </div>
          <div class="materia-card-footer">
            <span class="materia-id">ID: {{ materia.id }}</span>
            <span class="materia-action-link">Ver Temas &rarr;</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const authStore = useAuthStore();
const idUsuario = authStore.user?.idUsuario;

// Estado
const materias = ref([]);
const cargando = ref(true);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const formAddVisible = ref(false);
const formAdd = reactive({ nombre: '', descripcion: '' });

const gradients = [
  'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Azul
  'linear-gradient(135deg, #10b981, #047857)', // Esmeralda
  'linear-gradient(135deg, #8b5cf6, #5b21b6)', // Violeta
  'linear-gradient(135deg, #ec4899, #be185d)', // Rosa
  'linear-gradient(135deg, #f59e0b, #b45309)', // Ámbar/Naranja
  'linear-gradient(135deg, #06b6d4, #0891b2)', // Cian
];

function getGradient(index) {
  return gradients[index % gradients.length];
}

// Mostrar mensaje temporal
function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar lista: GET /usuario-materia/usuario/{id}/materias
async function cargarMaterias() {
  if (!idUsuario) { router.push('/login'); return; }
  cargando.value = true;
  try {
    const { data } = await api.get(`/usuario-materia/usuario/${idUsuario}/materias`);
    materias.value = data;
  } catch (error) {
    if (error.response?.status === 404) {
      materias.value = [];
    } else {
      mostrarMensaje('Error de conexión con el servidor', 'error');
    }
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarMaterias);

// Formulario crear
function mostrarFormAdd() {
  formAdd.nombre = '';
  formAdd.descripcion = '';
  formAddVisible.value = true;
}
function ocultarFormAdd() { formAddVisible.value = false; }

// Crear: POST /materia + POST /usuario-materia
async function crearMateria() {
  if (!formAdd.nombre.trim()) { mostrarMensaje('El nombre no puede estar vacío', 'error'); return; }
  if (!formAdd.descripcion.trim()) { mostrarMensaje('La descripción no puede estar vacía', 'error'); return; }

  const slug = formAdd.nombre.toLowerCase().replace(/\s+/g, '-');
  guardando.value = true;
  try {
    const { data: materiaCreada } = await api.post('/materia', {
      nombre: formAdd.nombre,
      descripcion: formAdd.descripcion,
      slug
    });

    // Crear relación usuario-materia
    await api.post('/usuario-materia', {
      idUsuario: idUsuario,
      idMateria: materiaCreada.id
    });

    mostrarMensaje('Materia registrada y asignada correctamente');
    ocultarFormAdd();
    await cargarMaterias();
  } catch {
    mostrarMensaje('Error al registrar materia', 'error');
  } finally {
    guardando.value = false;
  }
}

// Navegar a temas de la materia seleccionada
function irATemas(materia) {
  router.push({ name: 'tema', params: { idMateria: materia.id, nombreMateria: materia.nombre } });
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

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.view-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 6px 0;
  letter-spacing: -0.025em;
}

.view-subtitle {
  font-size: 0.95rem;
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
  box-shadow: none;
}

/* Formulario Modal */
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

/* Grid de tarjetas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 8px;
}

.materia-card {
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  cursor: pointer;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, filter 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Brillo en hover */
.materia-card::before {
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

.materia-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  filter: brightness(1.05);
}

.materia-card:hover::before {
  opacity: 1;
}

.materia-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1;
}

.materia-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.materia-desc {
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.materia-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.95;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
}

.materia-id {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
}

.materia-action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s;
}

.materia-card:hover .materia-action-link {
  transform: translateX(4px);
}

/* Mensajes de estado */
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

/* Estado de carga */
.estado-carga {
  grid-column: 1 / -1;
  padding: 60px;
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
  padding: 60px;
  text-align: center;
}

.sin-datos {
  color: #718096;
  font-size: 1.05rem;
  margin: 0;
}

/* Animaciones */
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
