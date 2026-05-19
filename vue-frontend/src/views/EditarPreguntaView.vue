<template>
  <div class="content-view">
    <div class="topbar">
      <div class="topbar-left">
        <h2>Editar Pregunta - <span class="tag-info">{{ nombreEjercicio }}</span></h2>
      </div>
    </div>

    <section class="card">
      <div v-if="cargando" class="estado-carga">Cargando datos de la pregunta...</div>
      <form v-else @submit.prevent="guardarCambios" class="form-grid">
        <div class="form-group">
          <label for="enunciadoPregunta">Enunciado de la pregunta</label>
          <textarea id="enunciadoPregunta" v-model="enunciado" rows="4" required></textarea>
        </div>

        <div class="opciones-section">
          <h3>Opciones de respuesta</h3>
          
          <div v-for="(opcion, index) in opciones" :key="opcion.id || index" class="opcion-item">
            <input 
              type="radio" 
              name="opcionCorrecta" 
              v-model="indiceCorrecta" 
              :value="index" 
              required 
            />
            <input 
              type="text" 
              v-model="opcion.texto" 
              placeholder="Texto de la opcion" 
              required 
              class="opcion-texto"
            />
            <button type="button" class="btn-remove" @click="eliminarOpcion(index)" v-if="opciones.length > 2">✕</button>
          </div>

          <button type="button" class="btn-secondary" @click="agregarOpcion">+ Agregar opcion</button>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button type="button" class="btn-secondary" @click="volverAEjercicio">Cancelar</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

const idPregunta = route.query.idPregunta;
const idEjercicio = route.query.idEjercicio;
const nombreEjercicio = route.query.nombreEjercicio;
const idSubtema = route.query.idSubtema;
const nombreSubtema = route.query.nombreSubtema;

const enunciado = ref('');
const opciones = ref([]);
const indiceCorrecta = ref(null);
const cargando = ref(true);
const guardando = ref(false);

async function cargarDatos() {
  if (!idPregunta) { volverAEjercicio(); return; }
  cargando.value = true;
  try {
    // Cargar pregunta
    const resPregunta = await api.get(`/pregunta/${idPregunta}`);
    enunciado.value = resPregunta.data.enunciado;

    // Cargar opciones
    const resOpciones = await api.get(`/pregunta/${idPregunta}/opciones`);
    opciones.value = resOpciones.data.map((op, index) => {
      if (op.correcta) indiceCorrecta.value = index;
      return { id: op.id, texto: op.texto };
    });
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar la pregunta');
    volverAEjercicio();
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarDatos);

function agregarOpcion() {
  opciones.value.push({ texto: '' });
}

async function eliminarOpcion(index) {
  const opcion = opciones.value[index];
  if (opcion.id) {
    if (!confirm('Deseas eliminar esta opcion permanentemente?')) return;
    try {
      await api.delete(`/opcion/${opcion.id}`);
    } catch (error) {
      alert('No se pudo eliminar la opcion del servidor');
      return;
    }
  }
  
  opciones.value.splice(index, 1);
  if (indiceCorrecta.value === index) indiceCorrecta.value = null;
  else if (indiceCorrecta.value > index) indiceCorrecta.value--;
}

async function guardarCambios() {
  if (!enunciado.value.trim()) return;
  if (indiceCorrecta.value === null) {
    alert('Selecciona la opcion correcta');
    return;
  }

  guardando.value = true;
  try {
    // 1. Actualizar pregunta
    await api.put(`/pregunta/${idPregunta}`, {
      id: idPregunta,
      enunciado: enunciado.value.trim(),
      idEjercicio: idEjercicio
    });

    // 2. Actualizar/Crear opciones
    const promesas = opciones.value.map((op, index) => {
      const payload = {
        texto: op.texto.trim(),
        correcta: indiceCorrecta.value === index,
        idPregunta: idPregunta
      };

      if (op.id) {
        return api.put(`/opcion/${op.id}`, { id: op.id, ...payload });
      } else {
        return api.post('/opcion', payload);
      }
    });

    await Promise.all(promesas);

    alert('Pregunta actualizada correctamente');
    volverAEjercicio();
  } catch (error) {
    console.error(error);
    alert('Error al guardar los cambios');
  } finally {
    guardando.value = false;
  }
}

function volverAEjercicio() {
  router.push({ 
    name: 'editar-ejercicio', 
    query: { idEjercicio, idSubtema, nombreSubtema } 
  });
}
</script>

<style scoped>
.content-view {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.topbar { margin-bottom: 24px; }
.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-left h2 { font-size: 1.3rem; margin: 0; }
.tag-info { color: #2563eb; font-weight: 700; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

.form-grid { display: flex; flex-direction: column; gap: 24px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 600; color: #4a5568; }
.form-group textarea {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: #f7fafc;
}

.opciones-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf2f7;
}

.opcion-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.opcion-texto {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  position: relative;
  z-index: 5;
  pointer-events: auto;
}

.btn-remove {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
}

.form-actions { display: flex; gap: 12px; margin-top: 12px; }

.btn-primary {
  padding: 12px 24px;
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

.estado-carga { padding: 24px; text-align: center; color: #718096; }
</style>
