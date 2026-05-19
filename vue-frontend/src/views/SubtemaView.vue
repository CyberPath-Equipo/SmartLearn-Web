<template>
  <div class="content-view">

    <div class="topbar">
      <div class="topbar-left">
        <h2>Subtemas de: <span class="tag-info">{{ nombreTema }}</span></h2>
      </div>
      <button class="btn-primary" @click="mostrarFormAdd">+ Nuevo Subtema</button>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- Formulario: crear subtema -->
    <div v-if="formAddVisible" class="form-inline card">
      <h3>Nuevo subtema</h3>
      <form @submit.prevent="crearSubtema" class="form-grid">
        <div class="form-group">
          <label for="nombreSubtema">Nombre del subtema</label>
          <input id="nombreSubtema" type="text" v-model="formAdd.nombre" placeholder="Nombre del subtema" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
          <button type="button" class="btn-secondary" @click="ocultarFormAdd">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Formulario: editar subtema -->
    <div v-if="formEditVisible" class="form-inline card">
      <h3>Editar subtema</h3>
      <form @submit.prevent="editarSubtema" class="form-grid">
        <div class="form-group">
          <label for="editNombreSubtema">Nombre</label>
          <input id="editNombreSubtema" type="text" v-model="formEdit.nombre" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Actualizar' }}
          </button>
          <button type="button" class="btn-secondary" @click="ocultarFormEdit">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla de subtemas -->
    <div class="table-container">
      <div v-if="cargando" class="estado-carga">Cargando subtemas...</div>
      <table v-else class="tabla-crud">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="subtemas.length === 0">
            <td colspan="3" class="sin-datos">No hay subtemas registrados</td>
          </tr>
          <!-- ID clickeable navega a la teoria del subtema -->
          <tr v-for="subtema in subtemas" :key="subtema.id">
            <td
              class="id-link"
              @click="irATeoria(subtema)"
              :title="'Ver teoria de ' + subtema.nombre"
            >{{ subtema.id }}</td>
            <td>{{ subtema.nombre }}</td>
            <td class="acciones">
              <button class="btn-edit" @click="mostrarFormEdit(subtema)">Editar</button>
              <button class="btn-delete" @click="eliminarSubtema(subtema.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

// Parámetros del tema padre
const idTema = route.params.idTema;
const nombreTema = route.params.nombreTema;

// Estado
const subtemas = ref([]);
const cargando = ref(true);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const formAddVisible = ref(false);
const formEditVisible = ref(false);
const subtemaIdEditando = ref(null);

const formAdd = reactive({ nombre: '' });
const formEdit = reactive({ nombre: '' });

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar subtemas: GET /tema/{idTema}/subtemas
async function cargarSubtemas() {
  if (!idTema) { router.back(); return; }
  cargando.value = true;
  try {
    const { data } = await api.get(`/tema/${idTema}/subtemas`);
    subtemas.value = Array.isArray(data) ? data : [];
    if (subtemas.value.length === 0) mostrarMensaje('No hay subtemas aun');
  } catch (error) {
    if (error.response?.status === 404) {
      subtemas.value = [];
      mostrarMensaje('No hay subtemas aun');
    } else {
      mostrarMensaje('Error cargando subtemas', 'error');
    }
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarSubtemas);

function mostrarFormAdd() {
  formAdd.nombre = '';
  formAddVisible.value = true;
  formEditVisible.value = false;
}
function ocultarFormAdd() { formAddVisible.value = false; }

function mostrarFormEdit(subtema) {
  subtemaIdEditando.value = subtema.id;
  formEdit.nombre = subtema.nombre;
  formEditVisible.value = true;
  formAddVisible.value = false;
}
function ocultarFormEdit() {
  formEditVisible.value = false;
  subtemaIdEditando.value = null;
}

// Crear: POST /subtema — JSON: { nombre, idTema }
async function crearSubtema() {
  guardando.value = true;
  try {
    await api.post('/subtema', {
      nombre: formAdd.nombre,
      idTema: idTema
    });
    mostrarMensaje('Subtema creado');
    ocultarFormAdd();
    await cargarSubtemas();
  } catch {
    mostrarMensaje('No se pudo guardar', 'error');
  } finally {
    guardando.value = false;
  }
}

// Editar: PUT /subtema/{id} — JSON: { nombre, idTema }
async function editarSubtema() {
  if (!subtemaIdEditando.value) return;
  guardando.value = true;
  try {
    await api.put(`/subtema/${subtemaIdEditando.value}`, {
      nombre: formEdit.nombre,
      idTema: parseInt(idTema)
    });
    mostrarMensaje('Subtema actualizado');
    ocultarFormEdit();
    await cargarSubtemas();
  } catch {
    mostrarMensaje('No se pudo actualizar', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar: DELETE /subtema/{id}
async function eliminarSubtema(id) {
  if (!confirm('Eliminar este subtema?')) return;
  try {
    await api.delete(`/subtema/${id}`);
    mostrarMensaje('Subtema eliminado');
    await cargarSubtemas();
  } catch {
    mostrarMensaje('Error al eliminar', 'error');
  }
}

// Navegar a la teoria del subtema seleccionado
function irATeoria(subtema) {
  router.push({ name: 'teoria', params: { idSubtema: subtema.id, nombreSubtema: subtema.nombre } });
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

.tag-info { color: #2563eb; font-weight: 700; }

.form-inline { padding: 24px; }

.form-inline h3 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.form-grid { display: flex; flex-direction: column; gap: 16px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.form-group input {
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2d3748;
  background: #f7fafc;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  background: #fff;
}

.form-actions { display: flex; gap: 10px; }

.table-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  border: 1px solid #edf2f7;
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
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-crud td {
  padding: 13px 16px;
  font-size: 0.95rem;
  color: #2d3748;
  border-bottom: 1px solid #f0f4f8;
}

.tabla-crud tbody tr:hover { background: #f7fafc; }
.tabla-crud tbody tr:last-child td { border-bottom: none; }

.id-link { cursor: pointer; color: #2563eb; font-weight: 700; }
.id-link:hover { text-decoration: underline; }

.sin-datos { text-align: center; color: #a0aec0; padding: 24px !important; }
.acciones { display: flex; gap: 8px; }

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

.btn-primary {
  padding: 9px 18px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  padding: 9px 18px;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary:hover { background: #e2e8f0; }

.btn-ghost {
  padding: 8px 16px;
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-ghost:hover { background: #f7fafc; color: #2d3748; }

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
.btn-edit:hover { background: #bee3f8; }

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
.btn-delete:hover { background: #fed7d7; }

.mensaje-estado {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}
.msg-exito { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
.msg-error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

.estado-carga { padding: 24px; text-align: center; color: #718096; }
</style>
