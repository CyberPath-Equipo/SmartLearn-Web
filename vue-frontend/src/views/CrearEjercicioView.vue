<template>
  <div class="content-view">

    <div class="topbar">
      <div class="topbar-left">
        <h2>
          Crear Ejercicio
          <span v-if="nombreSubtema" class="tag-info">
            - {{ nombreSubtema }}
          </span>
        </h2>
      </div>
    </div>

    <section class="card">

      <form @submit.prevent="guardarEjercicio" class="form-grid">

        <!-- =========================
             DATOS EJERCICIO
        ========================== -->
        <div class="section-box">

          <h3>Datos del ejercicio</h3>

          <div class="form-group">
            <label for="nombreEjercicio">
              Nombre del ejercicio
            </label>

            <input
              id="nombreEjercicio"
              type="text"
              v-model.trim="ejercicio.nombre"
              placeholder="Ej. Variables y tipos de datos"
              autocomplete="off"
              required
            />
          </div>

        </div>

        <!-- BOTONES -->
        <div class="form-actions">

          <button
            type="submit"
            class="btn-primary"
            :disabled="guardando"
          >
            {{
              guardando
                ? 'Guardando ejercicio...'
                : 'Siguiente: Agregar Preguntas'
            }}
          </button>
          
          <button
            type="button"
            class="btn-secondary"
            style="margin-top: 12px;"
            @click="volverATeoria"
          >
            Cancelar
          </button>

        </div>

      </form>

    </section>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();

const idSubtema = Number(route.query.idSubtema);
const nombreSubtema = route.query.nombreSubtema || '';

const guardando = ref(false);

const ejercicio = reactive({
  nombre: ''
});

function volverATeoria() {
  router.push({
    name: 'teoria',
    params: {
      idSubtema,
      nombreSubtema
    }
  });
}

async function guardarEjercicio() {

  // VALIDACIONES
  if (!ejercicio.nombre) {
    alert('Ingresa el nombre del ejercicio');
    return;
  }

  guardando.value = true;

  try {

    // =========================
    // CREAR EJERCICIO
    // =========================
    const { data: ejercicioCreado } = await api.post(
      '/ejercicio',
      {
        nombre: ejercicio.nombre,
        idSubtema
      }
    );

    alert('Ejercicio creado con éxito. Ahora agrega las preguntas.');

    // Redirigir a crear preguntas con los parámetros necesarios
    router.push({
      name: 'crear-preguntas',
      query: {
        idEjercicio: ejercicioCreado.id,
        nombreEjercicio: ejercicioCreado.nombre,
        idSubtema,
        nombreSubtema
      }
    });

  }

  catch (error) {

    console.error(
      'Error creando ejercicio:',
      error
    );

    alert(
      'Ocurrió un error al guardar el ejercicio'
    );

  }

  finally {

    guardando.value = false;

  }

}
</script>


<style scoped>
.content-view {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.topbar { margin-bottom: 24px; }
.topbar h2 { font-size: 1.5rem; color: #2d3748; margin: 0; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #edf2f7;
}

.form-grid { display: flex; flex-direction: column; gap: 32px; }

.section-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f4f8;
}

.section-box h3 {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0;
  font-weight: 700;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 600; color: #4a5568; font-size: 0.9rem; }

.form-group input, .form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.opciones-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opciones-container label { font-weight: 600; color: #4a5568; font-size: 0.9rem; }
.instruccion { font-size: 0.8rem; color: #718096; margin: 0; }
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

.opcion-input {
  flex: 1;
  width: 100%;
  min-width: 0;

  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #fff;
  color: #2d3748;

  font-size: 0.95rem;

  box-sizing: border-box;
}

.opcion-input::placeholder {
  color: #a0aec0;
}

.opcion-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  outline: none;
}

.btn-remove {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1.2rem;
  cursor: pointer;
}

.btn-primary {
  padding: 14px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  padding: 8px 16px;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  align-self: flex-start;
}

.btn-sm { padding: 6px 12px; }

.form-actions { display: flex; flex-direction: column; }
</style>
