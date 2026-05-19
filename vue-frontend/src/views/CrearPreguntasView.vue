<template>
  <div class="content-view">
    <div class="topbar">
      <div class="topbar-left">
        <h2>Nueva Pregunta - <span class="tag-info">{{ nombreEjercicio }}</span></h2>
      </div>
    </div>

    <section class="card">
      <form @submit.prevent="guardarPregunta" class="form-grid">
        <div class="form-group">
          <label for="enunciadoPregunta">Enunciado de la pregunta</label>
          <textarea id="enunciadoPregunta" v-model="enunciado" rows="4" placeholder="Escribe la pregunta..." required></textarea>
        </div>

        <div class="opciones-section">
          <h3>Opciones de respuesta</h3>
          <p class="instruccion">Marca el radio de la opcion que sea la correcta.</p>

          <div v-for="(opcion, index) in opciones" :key="opcion.id" class="opcion-item">
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
            {{ guardando ? 'Guardando...' : 'Guardar pregunta' }}
          </button>
          <button type="button" class="btn-secondary" @click="limpiarFormulario">Limpiar</button>
          <button type="button" class="btn-ghost" @click="volverAEjercicio">Finalizar</button>
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

const idEjercicio = route.query.idEjercicio;
const nombreEjercicio = route.query.nombreEjercicio;
const idSubtema = route.query.idSubtema;
const nombreSubtema = route.query.nombreSubtema;

const enunciado = ref('');
const opciones = ref([
  { id: 1, texto: '' },
  { id: 2, texto: '' }
]);
const indiceCorrecta = ref(null);
const guardando = ref(false);

let nextId = 3;
onMounted(() => {
  if (!idEjercicio) {
    alert('Ejercicio no encontrado');
    router.push({ name: 'teoria', params: { idSubtema, nombreSubtema } });
  }
});

function agregarOpcion() {
  opciones.value.push({ id: nextId++, texto: '' });
}

function eliminarOpcion(index) {
  opciones.value.splice(index, 1);
  if (indiceCorrecta.value === index) indiceCorrecta.value = null;
  else if (indiceCorrecta.value > index) indiceCorrecta.value--;
}

async function guardarPregunta() {
  if (!enunciado.value.trim()) return;
  if (indiceCorrecta.value === null) {
    alert('Selecciona la opcion correcta');
    return;
  }

  guardando.value = true;
  try {
    // 1. Crear pregunta
    const { data: pregunta } = await api.post('/pregunta', {
      enunciado: enunciado.value.trim(),
      idEjercicio: idEjercicio
    });

    // 2. Crear opciones (secuencialmente o en paralelo segun logica original)
    const promesas = opciones.value.map((op, index) => {
      return api.post('/opcion', {
        texto: op.texto.trim(),
        correcta: indiceCorrecta.value === index,
        idPregunta: pregunta.id
      });
    });

    await Promise.all(promesas);

    alert('Pregunta creada correctamente');
    limpiarFormulario();
  } catch (error) {
    console.error(error);
    alert('Error al guardar la pregunta');
  } finally {
    guardando.value = false;
  }
}

function limpiarFormulario() {
  enunciado.value = '';
  opciones.value = [
    { texto: '' },
    { texto: '' }
  ];
  indiceCorrecta.value = null;
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

.instruccion { font-size: 0.85rem; color: #718096; margin: 0; }

.opcion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.opcion-item input[type="radio"] {
  flex-shrink: 0;
  margin: 0;
  width: 18px;
  height: 18px;
}

.opcion-input {
  flex: 1;
  min-width: 0;
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
</style>
