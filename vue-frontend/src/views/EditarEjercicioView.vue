<template>
  <div class="content-view">
    <div class="topbar">
      <div class="topbar-left">
        <h2>Editar - Ejercicio</h2>
      </div>
    </div>

    <section class="card">
      <h3>Datos del ejercicio</h3>
      <form @submit.prevent="guardarCambios" class="form-grid">
        <div class="form-group">
          <label for="nombre">Nombre del ejercicio</label>
          <input type="text" id="nombre" v-model="ejercicio.nombre" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button type="button" class="btn-secondary" @click="volver">Cancelar</button>
        </div>
      </form>

      <div class="preguntas-section">
        <div class="preguntas-header">
          <h3>Preguntas</h3>
          <button class="btn-primary" @click="irACrearPregunta">+ Nueva pregunta</button>
        </div>

        <div class="table-container">
          <div v-if="cargandoPreguntas" class="estado-carga">Cargando preguntas...</div>
          <table v-else class="tabla-crud">
            <thead>
              <tr>
                <th>ID</th>
                <th>Enunciado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="preguntas.length === 0">
                <td colspan="3" class="sin-datos">No hay preguntas registradas</td>
              </tr>
              <tr v-for="pregunta in preguntas" :key="pregunta.id">
                <td>{{ pregunta.id }}</td>
                <td>{{ pregunta.enunciado }}</td>
                <td class="acciones">
                  <button class="btn-edit" @click="editarPregunta(pregunta)">Editar</button>
                  <button class="btn-delete" @click="eliminarPregunta(pregunta.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

const idEjercicio = route.query.idEjercicio;
const idSubtema = route.query.idSubtema;
const nombreSubtema = route.query.nombreSubtema;

const ejercicio = reactive({ id: null, nombre: '' });
const preguntas = ref([]);
const cargandoPreguntas = ref(false);
const guardando = ref(false);

async function cargarEjercicio() {
  if (!idEjercicio) { volver(); return; }
  try {
    const { data } = await api.get(`/ejercicio/${idEjercicio}`);
    ejercicio.id = data.id;
    ejercicio.nombre = data.nombre ?? '';
    cargarPreguntas();
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el ejercicio');
    volver();
  }
}

async function cargarPreguntas() {
  cargandoPreguntas.value = true;
  try {
    const { data } = await api.get(`/ejercicio/${idEjercicio}/preguntas`);
    preguntas.value = Array.isArray(data) ? data : [];
  } catch (error) {
    preguntas.value = [];
  } finally {
    cargandoPreguntas.value = false;
  }
}

onMounted(cargarEjercicio);

async function guardarCambios() {
  if (!ejercicio.nombre.trim()) return;
  guardando.value = true;
  try {
    await api.put(`/ejercicio/${idEjercicio}`, {
      id: idEjercicio,
      nombre: ejercicio.nombre.trim(),
      idSubtema: idSubtema
    });
    alert('Ejercicio actualizado correctamente');
    volver();
  } catch (error) {
    console.error(error);
    alert('No se pudo actualizar el ejercicio');
  } finally {
    guardando.value = false;
  }
}

async function eliminarPregunta(id) {
  if (!confirm('Seguro que deseas eliminar esta pregunta?')) return;
  try {
    await api.delete(`/pregunta/${id}`);
    alert('Pregunta eliminada correctamente');
    cargarPreguntas();
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar la pregunta');
  }
}

function volver() {
  router.push({ name: 'teoria', params: { idSubtema, nombreSubtema } });
}

function irACrearPregunta() {
  router.push({ 
    name: 'crear-preguntas', 
    query: { 
      idEjercicio, 
      nombreEjercicio: ejercicio.nombre,
      idSubtema,
      nombreSubtema
    } 
  });
}

function editarPregunta(pregunta) {
  router.push({ 
    name: 'editar-pregunta', 
    query: { 
      idPregunta: pregunta.id,
      idEjercicio, 
      nombreEjercicio: ejercicio.nombre,
      idSubtema,
      nombreSubtema
    } 
  });
}
</script>

<style scoped>
.content-view {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-left h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
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
}

.form-actions { display: flex; gap: 12px; }

.preguntas-section {
  border-top: 1px solid #edf2f7;
  padding-top: 32px;
}

.preguntas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-container {
  border: 1px solid #edf2f7;
  border-radius: 8px;
  overflow: hidden;
}

.tabla-crud { width: 100%; border-collapse: collapse; }
.tabla-crud thead { background: #f7fafc; }
.tabla-crud th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  color: #718096;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}
.tabla-crud td {
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #2d3748;
  border-bottom: 1px solid #f0f4f8;
}

.sin-datos { text-align: center; color: #a0aec0; padding: 24px !important; }
.acciones { display: flex; gap: 8px; }

.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  padding: 10px 20px;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-ghost {
  padding: 8px 16px;
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.btn-edit {
  padding: 6px 12px;
  background: #ebf4ff;
  color: #2b6cb0;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-delete {
  padding: 6px 12px;
  background: #fff5f5;
  color: #c53030;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.estado-carga { padding: 24px; text-align: center; color: #718096; }
</style>
