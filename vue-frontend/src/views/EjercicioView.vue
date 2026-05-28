<template>
  <div class="content-view">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs" v-if="idEjercicio">
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
      <router-link
        v-if="idSubtema"
        :to="{ name: 'teoria', params: { idSubtema: idSubtema, nombreSubtema: nombreSubtema } }"
        class="breadcrumb-item"
      >
        {{ nombreSubtema }}
      </router-link>
      <span v-else class="breadcrumb-item">Teoría</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Ver Ejercicio</span>
    </div>

    <div v-else class="breadcrumbs">
      <router-link to="/dashboard" class="breadcrumb-item">Inicio</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">Ejercicios</span>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- ========== MODO: VER EJERCICIO ========== -->
    <div v-if="idEjercicio" class="exercise-details-container">
      
      <!-- Header del Ejercicio -->
      <div class="exercise-header-card animate-slide-up">
        <div class="exercise-info">
          <span class="exercise-badge">Visualizando Ejercicio</span>
          <h2 class="exercise-title">{{ ejercicio.nombre || 'Cargando ejercicio...' }}</h2>
          <p class="exercise-desc">Revisa el banco de preguntas asignadas a este ejercicio práctico.</p>
        </div>
        <div class="exercise-actions">
          <button class="btn-action-edit" @click="irAEditarEjercicio">
            <span class="btn-icon">✏️</span> Editar Ejercicio / Preguntas
          </button>
          <button class="btn-action-delete" @click="eliminarEjercicioActivo">
            <span class="btn-icon">🗑️</span> Eliminar Ejercicio
          </button>
          <button class="btn-action-back" @click="volverATeoria">
            &larr; Volver a Teoría
          </button>
        </div>
      </div>

      <!-- Sección de Preguntas -->
      <div class="questions-section">
        <h3 class="section-title">Preguntas Registradas ({{ preguntas.length }})</h3>
        
        <div v-if="cargandoPreguntas" class="estado-carga">
          <div class="spinner"></div>
          <p>Consultando banco de preguntas...</p>
        </div>

        <div v-else class="questions-grid">
          <div v-if="preguntas.length === 0" class="no-questions-card">
            <p>Este ejercicio aún no tiene preguntas. ¡Haz clic en 'Editar Ejercicio' para agregar la primera!</p>
          </div>

          <div
            v-else
            v-for="(pregunta, index) in preguntas"
            :key="pregunta.id"
            class="question-card animate-slide-up"
          >
            <div class="question-card-header">
              <span class="question-number">Pregunta {{ index + 1 }}</span>
              <span class="question-id-tag">ID: {{ pregunta.id }}</span>
            </div>
            
            <p class="question-statement">{{ pregunta.enunciado }}</p>
            
            <div class="options-container">
              <div
                v-for="opcion in pregunta.opciones"
                :key="opcion.id"
                :class="['option-item-display', { 'correct-option': opcion.correcta }]"
              >
                <span class="option-marker">{{ opcion.correcta ? '✓' : '○' }}</span>
                <span class="option-text">{{ opcion.texto }}</span>
                <span class="correct-badge" v-if="opcion.correcta">Respuesta Correcta</span>
              </div>
              <div v-if="!pregunta.opciones || pregunta.opciones.length === 0" class="no-options-text">
                Sin opciones de respuesta registradas.
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <!-- ========== MODO: GENERAL / SIN ID ========== -->
    <div v-else class="general-exercises-container animate-slide-up">
      <div class="no-id-card">
        <div class="no-id-icon">🎯</div>
        <h2>Gestión de Ejercicios</h2>
        <p>
          La creación, edición y administración de los ejercicios se realiza de forma contextual dentro de los 
          subtemas de cada materia para mantener organizados los contenidos académicos.
        </p>
        <router-link to="/materias" class="btn-primary-blue link-button">
          Ir al Panel de Materias
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

const idEjercicio = route.query.idEjercicio;
const idSubtema = route.query.idSubtema;
const nombreSubtema = route.query.nombreSubtema;

// Estado
const ejercicio = ref({ id: idEjercicio, nombre: '' });
const preguntas = ref([]);
const cargando = ref(false);
const cargandoPreguntas = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

// Jerarquía de padres para breadcrumbs
const subtema = ref({ id: idSubtema, nombre: nombreSubtema, idTema: null });
const tema = ref({ id: null, nombre: '', idMateria: null });
const materia = ref({ id: null, nombre: '' });

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar jerarquía de padres para breadcrumbs
async function cargarDatosPadres() {
  if (!idSubtema) return;
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
    console.error('Error al cargar datos jerárquicos de breadcrumbs:', error);
  }
}

// Cargar datos del ejercicio
async function cargarEjercicio() {
  if (!idEjercicio) return;
  cargando.value = true;
  try {
    const { data } = await api.get(`/ejercicio/${idEjercicio}`);
    if (data) {
      ejercicio.value = data;
      await cargarPreguntasYOpciones();
    }
  } catch (error) {
    console.error('Error al cargar datos del ejercicio:', error);
    mostrarMensaje('No se pudo cargar el ejercicio', 'error');
  } finally {
    cargando.value = false;
  }
}

// Cargar preguntas y sus respectivas opciones
async function cargarPreguntasYOpciones() {
  cargandoPreguntas.value = true;
  try {
    const { data: listaPreguntas } = await api.get(`/ejercicio/${idEjercicio}/preguntas`);
    if (Array.isArray(listaPreguntas)) {
      const promesas = listaPreguntas.map(async (preg) => {
        try {
          const { data: listaOpciones } = await api.get(`/pregunta/${preg.id}/opciones`);
          return {
            ...preg,
            opciones: listaOpciones || []
          };
        } catch {
          return {
            ...preg,
            opciones: []
          };
        }
      });
      preguntas.value = await Promise.all(promesas);
    }
  } catch (error) {
    console.error('Error al cargar preguntas:', error);
  } finally {
    cargandoPreguntas.value = false;
  }
}

onMounted(() => {
  if (idEjercicio) {
    cargarDatosPadres();
    cargarEjercicio();
  }
});

// Eliminar ejercicio
async function eliminarEjercicioActivo() {
  if (!confirm('¿Seguro que deseas eliminar este ejercicio? Se eliminarán todas sus preguntas y opciones.')) return;
  try {
    await api.delete(`/ejercicio/${idEjercicio}`);
    mostrarMensaje('Ejercicio eliminado con éxito');
    setTimeout(() => {
      volverATeoria();
    }, 1000);
  } catch {
    mostrarMensaje('No se pudo eliminar el ejercicio', 'error');
  }
}

// Navegación
function irAEditarEjercicio() {
  router.push({
    name: 'editar-ejercicio',
    query: { idEjercicio, idSubtema, nombreSubtema }
  });
}

function volverATeoria() {
  router.push({
    name: 'teoria',
    params: { idSubtema, nombreSubtema }
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

/* Header del Ejercicio */
.exercise-header-card {
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

.exercise-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 65%;
}

.exercise-badge {
  align-self: flex-start;
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.exercise-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
  letter-spacing: -0.025em;
}

.exercise-desc {
  font-size: 0.98rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

.exercise-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
}

.btn-action-edit, .btn-action-delete, .btn-action-back {
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
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}
.btn-action-edit:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
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

.btn-action-back {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}
.btn-action-back:hover {
  background: #edf2f7;
  color: #1a202c;
}

/* Sección de Preguntas */
.questions-section {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.questions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.question-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.question-number {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2563eb;
}

.question-id-tag {
  font-size: 0.8rem;
  color: #a0aec0;
}

.question-statement {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 0.95rem;
  color: #4a5568;
}

.option-marker {
  font-weight: bold;
}

.option-text {
  flex: 1;
}

.correct-option {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
  font-weight: 600;
}

.correct-option .option-marker {
  color: #10b981;
}

.correct-badge {
  background: #10b981;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.no-options-text, .no-questions-card {
  color: #718096;
  text-align: center;
}

.no-questions-card {
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  padding: 40px;
  border-radius: 16px;
}

/* Fallback Modo General sin ID */
.general-exercises-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.no-id-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-id-icon {
  font-size: 3.5rem;
}

.no-id-card h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
}

.no-id-card p {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.btn-primary-blue {
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary-blue:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
}

/* Carga */
.estado-carga {
  padding: 40px;
  text-align: center;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

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
