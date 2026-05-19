<template>
  <div class="content-view">
    <div class="topbar">
      <div class="topbar-left">
        <h2>Teoria - <span class="tag-info">{{ nombreSubtema }}</span></h2>
      </div>
      <div class="topbar-right" v-if="estado === 'ver'">
        <button class="btn-primary" @click="irACrearEjercicio">+ Crear ejercicio</button>
      </div>
    </div>

    <div v-if="mensaje" :class="['mensaje-estado', mensajeTipo]" role="status">
      {{ mensaje }}
    </div>

    <!-- ========== CREAR TEORIA ========== -->
    <section v-if="estado === 'crear'" class="card">
      <h3>Crear teoria</h3>
      <form @submit.prevent="guardarTeoria" class="form-grid">
        <div class="form-group">
          <label for="tituloTeoria">Titulo de la teoria</label>
          <input type="text" id="tituloTeoria" v-model="formTeoria.titulo" placeholder="Ej. Introduccion a las variables" required />
        </div>
        <div class="form-group">
          <label for="contenidoTeoria">Contenido</label>
          <textarea id="contenidoTeoria" v-model="formTeoria.contenido" rows="10" placeholder="Escribe aqui el contenido pedagogico..." required></textarea>
        </div>
        <button type="submit" class="btn-primary" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Crear teoria' }}
        </button>
      </form>
    </section>

    <!-- ========== EDITAR TEORIA ========== -->
    <section v-else-if="estado === 'editar'" class="card">
      <h3>Editar teoria</h3>
      <form @submit.prevent="actualizarTeoria" class="form-grid">
        <div class="form-group">
          <label for="editTituloTeoria">Titulo</label>
          <input type="text" id="editTituloTeoria" v-model="formTeoria.titulo" required />
        </div>
        <div class="form-group">
          <label for="editContenidoTeoria">Contenido</label>
          <textarea id="editContenidoTeoria" v-model="formTeoria.contenido" rows="10" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button type="button" class="btn-secondary" @click="estado = 'ver'">Cancelar</button>
          <button type="button" class="btn-delete" @click="eliminarTeoria">Eliminar teoria</button>
        </div>
      </form>
    </section>

    <!-- ========== VER TEORIA + EJERCICIOS ========== -->
    <div v-else-if="estado === 'ver'" class="teoria-container">
      <section class="card">
        <div class="teoria-header">
          <h3>{{ teoria.titulo || 'Teoria' }}</h3>
          <div class="acciones-header">
            <button class="btn-edit" @click="prepararEdicion">Editar</button>
            <button class="btn-delete" @click="eliminarTeoria">Eliminar</button>
          </div>
        </div>
        <div class="teoria-contenido">
          <p v-for="(parrafo, index) in parrafosTeoria" :key="index">{{ parrafo }}</p>
        </div>
      </section>

      <section class="card ejercicios-section">
        <div class="ejercicios-header">
          <h3>Lista de Ejercicios</h3>
        </div>

        <div class="table-container">
          <div v-if="cargandoEjercicios" class="estado-carga">Cargando ejercicios...</div>
          <table v-else class="tabla-crud">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="ejercicios.length === 0">
                <td colspan="3" class="sin-datos">No hay ejercicios registrados</td>
              </tr>
              <tr v-for="ejercicio in ejercicios" :key="ejercicio.id">
                <td class="id-link" @click="irAEditarEjercicio(ejercicio)">{{ ejercicio.id }}</td>
                <td>{{ ejercicio.nombre }}</td>
                <td class="acciones">
                  <button class="btn-edit" @click="irAEditarEjercicio(ejercicio)">Editar</button>
                  <button class="btn-delete" @click="eliminarEjercicio(ejercicio.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="cargando" class="estado-carga">Consultando teoria...</div>

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
const estado = ref('consultando'); // 'consultando', 'crear', 'ver', 'editar'
const teoria = reactive({ id: null, titulo: '', contenido: '' });
const ejercicios = ref([]);
const cargando = ref(true);
const cargandoEjercicios = ref(false);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const formTeoria = reactive({ titulo: '', contenido: '' });

const parrafosTeoria = computed(() => {
  if (!teoria.contenido) return [];
  return teoria.contenido.split('\n').filter(p => p.trim() !== '');
});

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.value = texto;
  mensajeTipo.value = tipo === 'exito' ? 'msg-exito' : 'msg-error';
  setTimeout(() => { mensaje.value = ''; }, 2500);
}

// Cargar teoria: GET /subtema/{idSubtema}/teoria
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
      mostrarMensaje('Error cargando teoria', 'error');
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

onMounted(cargarTeoria);

// Crear teoria: POST /teoria/docente
async function guardarTeoria() {
  guardando.value = true;
  try {
    const { data } = await api.post('/teoria/docente', {
      idSubtema: idSubtema,
      titulo: formTeoria.titulo,
      contenido: formTeoria.contenido
    });
    teoria.id = data.id;
    teoria.titulo = data.titulo;
    teoria.contenido = data.contenido;
    estado.value = 'ver';
    mostrarMensaje('Teoria creada correctamente');
    cargarEjercicios();
  } catch {
    mostrarMensaje('Error al crear teoria', 'error');
  } finally {
    guardando.value = false;
  }
}

// Preparar edicion
function prepararEdicion() {
  formTeoria.titulo = teoria.titulo;
  formTeoria.contenido = teoria.contenido;
  estado.value = 'editar';
}

// Actualizar teoria: PUT /teoria/docente/{id}
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
    mostrarMensaje('Teoria actualizada');
  } catch {
    mostrarMensaje('Error al actualizar teoria', 'error');
  } finally {
    guardando.value = false;
  }
}

// Eliminar teoria: DELETE /subtema/teoria/{idTeoria}
async function eliminarTeoria() {
  if (!confirm('Deseas eliminar esta teoria?')) return;
  try {
    await api.delete(`/subtema/teoria/${teoria.id}`);
    mostrarMensaje('Teoria eliminada');
    teoria.id = null;
    teoria.titulo = '';
    teoria.contenido = '';
    formTeoria.titulo = '';
    formTeoria.contenido = '';
    estado.value = 'crear';
  } catch {
    mostrarMensaje('No se pudo eliminar la teoria', 'error');
  }
}

// Eliminar ejercicio: DELETE /ejercicio/{id}
async function eliminarEjercicio(id) {
  if (!confirm('Seguro que deseas eliminar este ejercicio?')) return;
  try {
    await api.delete(`/ejercicio/${id}`);
    mostrarMensaje('Ejercicio eliminado');
    cargarEjercicios();
  } catch {
    mostrarMensaje('Error al eliminar el ejercicio', 'error');
  }
}

// Navegacion
function irACrearEjercicio() {
  router.push({ name: 'crear-ejercicio', query: { idSubtema, nombreSubtema } });
}

function irAEditarEjercicio(ejercicio) {
  router.push({ name: 'editar-ejercicio', query: { idEjercicio: ejercicio.id, idSubtema, nombreSubtema } });
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

.teoria-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.teoria-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.teoria-contenido {
  line-height: 1.7;
  color: #4a5568;
  font-size: 1.05rem;
}

.teoria-contenido p {
  margin-bottom: 16px;
}

.ejercicios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.form-group input, .form-group textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  background: #f7fafc;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  background: #fff;
}

.form-actions { display: flex; gap: 10px; margin-top: 10px; }

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

.id-link { cursor: pointer; color: #2563eb; font-weight: 700; }
.id-link:hover { text-decoration: underline; }

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

.mensaje-estado {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
}
.msg-exito { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
.msg-error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

.estado-carga { padding: 24px; text-align: center; color: #718096; }
</style>
