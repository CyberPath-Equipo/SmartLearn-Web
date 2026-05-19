<template>
  <div class="content-view">

    <div class="topbar">
      <h2>Materias disponibles</h2>
      <button class="btn-primary" @click="mostrarFormAdd">+ Nueva materia</button>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- Formulario: crear materia -->
    <div v-if="formAddVisible" class="form-inline card">
      <h3>Nueva materia</h3>
      <form @submit.prevent="crearMateria" class="form-grid">
        <div class="form-group">
          <label for="nombreMateria">Nombre</label>
          <input id="nombreMateria" type="text" v-model="formAdd.nombre" placeholder="Nombre de la materia" required />
        </div>
        <div class="form-group">
          <label for="descripcionMateria">Descripcion</label>
          <input id="descripcionMateria" type="text" v-model="formAdd.descripcion" placeholder="Descripcion de la materia" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
          <button type="button" class="btn-secondary" @click="ocultarFormAdd">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Formulario: editar materia -->
    <div v-if="formEditVisible" class="form-inline card">
      <h3>Editar materia</h3>
      <form @submit.prevent="editarMateria" class="form-grid">
        <div class="form-group">
          <label for="nombreMateriaEdit">Nombre</label>
          <input id="nombreMateriaEdit" type="text" v-model="formEdit.nombre" placeholder="Nombre de la materia" required />
        </div>
        <div class="form-group">
          <label for="descripcionEdit">Descripcion</label>
          <input id="descripcionEdit" type="text" v-model="formEdit.descripcion" placeholder="Descripcion" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
          <button type="button" class="btn-secondary" @click="ocultarFormEdit">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla de materias -->
    <div class="table-container">
      <div v-if="cargando" class="estado-carga">Cargando materias...</div>
      <table v-else class="tabla-crud">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="materias.length === 0">
            <td colspan="4" class="sin-datos">No hay materias registradas</td>
          </tr>
          <!-- ID clickeable navega a temas de esa materia -->
          <tr v-for="materia in materias" :key="materia.id">
            <td
              class="id-link"
              @click="irATemas(materia)"
              :title="'Ver temas de ' + materia.nombre"
            >{{ materia.id }}</td>
            <td>{{ materia.nombre }}</td>
            <td>{{ materia.descripcion ?? 'Sin descripcion' }}</td>
            <td class="acciones">
              <button class="btn-edit" @click="mostrarFormEdit(materia)">Editar</button>
              <button class="btn-delete" @click="eliminarMateria(materia.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
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
const formEditVisible = ref(false);
const materiaIdEditando = ref(null);

const formAdd = reactive({ nombre: '', descripcion: '' });
const formEdit = reactive({ nombre: '', descripcion: '' });

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
      mostrarMensaje('Error de conexion con el servidor', 'error');
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
  formEditVisible.value = false;
}
function ocultarFormAdd() { formAddVisible.value = false; }

// Formulario editar
function mostrarFormEdit(materia) {
  materiaIdEditando.value = materia.id;
  formEdit.nombre = materia.nombre;
  formEdit.descripcion = materia.descripcion ?? '';
  formEditVisible.value = true;
  formAddVisible.value = false;
}
function ocultarFormEdit() {
  formEditVisible.value = false;
  materiaIdEditando.value = null;
}

// Crear: POST /materia + POST /usuario-materia
async function crearMateria() {
  if (!formAdd.nombre.trim()) { mostrarMensaje('El nombre no puede estar vacio', 'error'); return; }
  if (!formAdd.descripcion.trim()) { mostrarMensaje('La descripcion no puede estar vacia', 'error'); return; }

  const slug = formAdd.nombre.toLowerCase().replace(/\s+/g, '-');
  guardando.value = true;
  try {
    const { data: materiaCreada } = await api.post('/materia', {
      nombre: formAdd.nombre,
      descripcion: formAdd.descripcion,
      slug
    });

    // Crear relacion usuario-materia
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

// Editar: PUT /materia/{id}
async function editarMateria() {
  if (!materiaIdEditando.value) return;
  if (!confirm('Seguro que quiere mantener los cambios en la materia?')) return;
  if (!formEdit.nombre.trim()) { mostrarMensaje('El nombre no puede estar vacio', 'error'); return; }

  guardando.value = true;
  try {
    await api.put(`/materia/${materiaIdEditando.value}`, {
      nombre: formEdit.nombre,
      descripcion: formEdit.descripcion
    });
    mostrarMensaje('Materia editada correctamente');
    ocultarFormEdit();
    await cargarMaterias();
  } catch {
    mostrarMensaje('Error al editar la materia', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar: DELETE /materia/{id}
async function eliminarMateria(id) {
  if (!confirm('Seguro que deseas eliminar la materia? Esta accion no se puede deshacer.')) return;
  try {
    await api.delete(`/materia/${id}`);
    mostrarMensaje('Materia eliminada correctamente');
    await cargarMaterias();
  } catch {
    mostrarMensaje('Error al eliminar la materia', 'error');
  }
}

// Navegar a temas de la materia seleccionada
function irATemas(materia) {
  router.push({ name: 'tema', params: { idMateria: materia.id, nombreMateria: materia.nombre } });
}
</script>

<style scoped>
/* Layout principal */
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

.topbar h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Formulario inline */
.form-inline {
  padding: 24px;
}

.form-inline h3 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.form-actions {
  display: flex;
  gap: 10px;
}

/* Tabla */
.table-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.tabla-crud {
  width: 100%;
  border-collapse: collapse;
}

.tabla-crud thead {
  background: #f7fafc;
}

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

.tabla-crud tbody tr:hover {
  background: #f7fafc;
}

.tabla-crud tbody tr:last-child td {
  border-bottom: none;
}

/* ID clickeable */
.id-link {
  cursor: pointer;
  color: #2563eb;
  font-weight: 700;
}

.id-link:hover {
  text-decoration: underline;
}

.sin-datos {
  text-align: center;
  color: #a0aec0;
  padding: 24px !important;
}

/* Acciones */
.acciones {
  display: flex;
  gap: 8px;
}

/* Botones */
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

/* Card reutilizado */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

/* Mensajes */
.mensaje-estado {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}
.msg-exito { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
.msg-error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

/* Loading */
.estado-carga {
  padding: 24px;
  text-align: center;
  color: #718096;
}
</style>
