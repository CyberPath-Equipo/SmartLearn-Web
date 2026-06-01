<template>
  <div class="dashboard-materia-container">
    <div class="dashboard-header">
      <h3>Analítica de la Materia</h3>
      <p>Métricas específicas de rendimiento y actividad de la materia.</p>
    </div>

    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Calculando estadísticas...</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- B1: Ejercicios con más errores -->
      <div class="chart-card">
        <h4>Ejercicios Problemáticos</h4>
        <p class="chart-desc">Ejercicios con mayor tasa de error o abandono.</p>
        <template v-if="hasB1Data">
          <apexchart type="bar" height="250" :options="chartB1Options" :series="chartB1Series"></apexchart>
        </template>
        <div v-else class="no-data-msg">
          <span class="no-data-icon">📊</span>
          <span>No hay intentos de ejercicios aún.</span>
        </div>
      </div>

      <!-- B2: Temas más activos -->
      <div class="chart-card">
        <h4>Actividad por Tema</h4>
        <p class="chart-desc">Cantidad de intentos realizados por los alumnos.</p>
        <template v-if="hasB2Data">
          <apexchart type="bar" height="250" :options="chartB2Options" :series="chartB2Series"></apexchart>
        </template>
        <div v-else class="no-data-msg">
          <span class="no-data-icon">📊</span>
          <span>No hay actividad registrada en los temas.</span>
        </div>
      </div>

      <!-- B3: Distribución de Recursos de la Materia -->
      <div class="chart-card">
        <h4>Distribución de Recursos</h4>
        <p class="chart-desc">Volumen de contenido existente en la materia.</p>
        <template v-if="hasB3Data">
          <apexchart type="bar" height="250" :options="chartB3Options" :series="chartB3Series"></apexchart>
        </template>
        <div v-else class="no-data-msg">
          <span class="no-data-icon">📦</span>
          <span>No hay recursos registrados en esta materia.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const props = defineProps({
  idMateria: {
    type: [Number, String],
    required: true
  }
});

const router = useRouter();
const cargando = ref(true);

// --- Flags de datos por dashboard ---
const hasB1Data = ref(false);
const hasB2Data = ref(false);
const hasB3Data = ref(false);

// --- B1: Ejercicios Problemáticos ---
const chartB1Series = ref([{ name: 'Tasa de Error (%)', data: [] }]);
// Mapa de índice → { idEjercicio, idSubtema, nombreSubtema } para la navegación
const ejercicioNavMap = ref({});

const chartB1Options = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    events: {
      dataPointSelection: (event, chartContext, config) => {
        const index = config.dataPointIndex;
        const nav = ejercicioNavMap.value[index];
        if (nav) {
          router.push({
            name: 'ejercicio',
            query: {
              idEjercicio: nav.idEjercicio,
              idSubtema: nav.idSubtema,
              nombreSubtema: nav.nombreSubtema
            }
          });
        }
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      colors: {
        ranges: [{ from: 0, to: 100, color: '#ef4444' }]
      }
    }
  },
  xaxis: { categories: [], max: 100 },
  tooltip: {
    y: { formatter: (val) => val.toFixed(1) + '%' }
  }
});

// --- B2: Actividad por Tema ---
const chartB2Series = ref([{ name: 'Intentos', data: [] }]);
const chartB2Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: [] },
  colors: ['#3b82f6']
});

// --- B3: Distribución de Recursos ---
const chartB3Series = ref([{ name: 'Cantidad', data: [] }]);
const chartB3Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
      distributed: true
    }
  },
  xaxis: {
    categories: ['Temas', 'Subtemas', 'Teorías', 'Ejercicios']
  },
  colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
  legend: { show: false },
  tooltip: {
    y: { formatter: (val) => val + ' elementos' }
  }
});

// --- Carga de datos ---
async function cargarEstadisticasMateria() {
  if (!props.idMateria) return;
  cargando.value = true;
  hasB1Data.value = false;
  hasB2Data.value = false;
  hasB3Data.value = false;

  try {
    let todosTemas = [];
    let todosSubtemas = [];
    let todosEjercicios = [];
    let intentos = [];
    let todasTeorias = [];

    try { const res = await api.get('/tema'); todosTemas = res.data || []; } catch (e) { /* 404 o error → array vacío */ }
    try { const res = await api.get('/subtema'); todosSubtemas = res.data || []; } catch (e) { /* vacío */ }
    try { const res = await api.get('/ejercicio'); todosEjercicios = res.data || []; } catch (e) { /* vacío */ }
    try { const res = await api.get('/intento-ejercicio'); intentos = res.data || []; } catch (e) { /* vacío */ }
    try { const res = await api.get('/teoria'); todasTeorias = res.data || []; } catch (e) { /* vacío */ }

    // Filtrado jerárquico: Materia → Temas → Subtemas → Ejercicios/Teorías
    const temasMateria = todosTemas.filter(t => String(t.idMateria) === String(props.idMateria));
    const idsTemasMateria = temasMateria.map(t => t.id);

    const subtemasMateria = todosSubtemas.filter(s => idsTemasMateria.includes(s.idTema));
    const idsSubtemasMateria = subtemasMateria.map(s => s.id);

    const ejerciciosMateria = todosEjercicios.filter(e => idsSubtemasMateria.includes(e.idSubtema));
    const idsEjerciciosMateria = ejerciciosMateria.map(e => e.id);

    const teoriasMateria = todasTeorias.filter(t => idsSubtemasMateria.includes(t.idSubtema));

    // Mapas auxiliares para navegación B1
    const subDict = {};
    subtemasMateria.forEach(s => { subDict[s.id] = { idTema: s.idTema, nombre: s.nombre }; });
    const ejDict = {};
    ejerciciosMateria.forEach(e => { ejDict[e.id] = e.idSubtema; });

    // ========== B1: Ejercicios con más errores ==========
    const statsEjercicios = {};
    ejerciciosMateria.forEach(e => statsEjercicios[e.id] = { nombre: e.nombre, intentos: 0, errores: 0 });

    const intentosMateria = intentos.filter(i => idsEjerciciosMateria.includes(i.idEjercicio));
    intentosMateria.forEach(i => {
      if (statsEjercicios[i.idEjercicio]) {
        statsEjercicios[i.idEjercicio].intentos++;
        const estadoLower = (i.estado || '').toLowerCase();
        if (i.puntaje < 70 || estadoLower === 'abandonado') {
          statsEjercicios[i.idEjercicio].errores++;
        }
      }
    });

    const errorRates = Object.entries(statsEjercicios)
      .filter(([, data]) => data.intentos > 0)
      .map(([id, data]) => ({
        id,
        nombre: data.nombre,
        tasa: (data.errores / data.intentos) * 100
      }))
      .sort((a, b) => b.tasa - a.tasa)
      .slice(0, 5);

    if (errorRates.length > 0) {
      hasB1Data.value = true;
      chartB1Options.value = {
        ...chartB1Options.value,
        xaxis: { ...chartB1Options.value.xaxis, categories: errorRates.map(er => er.nombre) }
      };
      chartB1Series.value = [{ name: 'Tasa de Error (%)', data: errorRates.map(er => er.tasa) }];

      // Construir mapa de navegación para cada barra
      const navMap = {};
      errorRates.forEach((er, idx) => {
        const idSub = ejDict[er.id];
        const subInfo = subDict[idSub] || {};
        navMap[idx] = {
          idEjercicio: er.id,
          idSubtema: idSub,
          nombreSubtema: subInfo.nombre || 'Subtema'
        };
      });
      ejercicioNavMap.value = navMap;
    }

    // ========== B2: Temas más activos ==========
    const actividadTemas = {};
    temasMateria.forEach(t => actividadTemas[t.id] = { nombre: t.nombre, intentos: 0 });

    intentosMateria.forEach(i => {
      const idSub = ejDict[i.idEjercicio];
      const subInfo = subDict[idSub];
      const idTema = subInfo?.idTema;
      if (idTema && actividadTemas[idTema]) {
        actividadTemas[idTema].intentos++;
      }
    });

    const sortedTemas = Object.values(actividadTemas)
      .filter(t => t.intentos > 0)
      .sort((a, b) => b.intentos - a.intentos)
      .slice(0, 5);

    if (sortedTemas.length > 0) {
      hasB2Data.value = true;
      chartB2Options.value = {
        ...chartB2Options.value,
        xaxis: { categories: sortedTemas.map(t => t.nombre) }
      };
      chartB2Series.value = [{ name: 'Intentos', data: sortedTemas.map(t => t.intentos) }];
    }

    // ========== B3: Distribución de Recursos ==========
    const totalTemas = temasMateria.length;
    const totalSubtemas = subtemasMateria.length;
    const totalTeorias = teoriasMateria.length;
    const totalEjercicios = ejerciciosMateria.length;

    if (totalTemas + totalSubtemas + totalTeorias + totalEjercicios > 0) {
      hasB3Data.value = true;
      chartB3Series.value = [{
        name: 'Cantidad',
        data: [totalTemas, totalSubtemas, totalTeorias, totalEjercicios]
      }];
    }

  } catch (error) {
    console.error('Error calculando estadísticas de la materia', error);
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarEstadisticasMateria);
watch(() => props.idMateria, cargarEstadisticasMateria);
</script>

<style scoped>
.dashboard-materia-container {
  margin-top: 32px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.dashboard-header p {
  color: #c7dbef;
  margin: 0;
  font-size: 0.95rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.chart-card h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.chart-desc {
  font-size: 0.85rem;
  color: #718096;
  margin: 0 0 16px 0;
}

.no-data-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #a0aec0;
  font-size: 0.95rem;
  text-align: center;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.no-data-icon {
  font-size: 1.8rem;
}

.estado-carga {
  padding: 40px;
  text-align: center;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
