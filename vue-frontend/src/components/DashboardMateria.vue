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
      <div class="chart-card chart-b1">
        <div class="chart-header">
          <h4>Ejercicios Problemáticos</h4>
          <p class="chart-desc">Ejercicios con mayor tasa de error o abandono.</p>
        </div>
        <template v-if="hasB1Data">
          <div class="chart-container">
            <apexchart type="bar" height="100%" :options="chartB1Options" :series="chartB1Series"></apexchart>
          </div>
        </template>
        <div v-else class="no-data-msg">
          <span class="no-data-icon">📊</span>
          <span>No hay intentos de ejercicios aún.</span>
        </div>
      </div>

      <!-- B2: Temas más activos -->
      <div class="chart-card chart-b2">
        <div class="chart-header">
          <h4>Actividad por Tema</h4>
          <p class="chart-desc">Cantidad de intentos realizados por los alumnos.</p>
        </div>
        <template v-if="hasB2Data">
          <div class="chart-container">
            <apexchart type="bar" height="100%" :options="chartB2Options" :series="chartB2Series"></apexchart>
          </div>
        </template>
        <div v-else class="no-data-msg">
          <span class="no-data-icon">📊</span>
          <span>No hay actividad registrada en los temas.</span>
        </div>
      </div>

      <!-- B3: Distribución de Recursos de la Materia -->
      <div class="chart-card chart-b3">
        <div class="chart-header">
          <h4>Distribución de Recursos</h4>
          <p class="chart-desc">Volumen de contenido existente en la materia.</p>
        </div>
        <template v-if="hasB3Data">
          <div class="chart-container">
            <apexchart type="bar" height="100%" :options="chartB3Options" :series="chartB3Series"></apexchart>
          </div>
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
        ranges: [{ from: 0, to: 100, color: '#475569' }]
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
  colors: ['#334155']
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
  colors: ['#1e293b', '#334155', '#475569', '#64748b'],
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
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dashboard-header {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.dashboard-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.dashboard-header p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  flex-grow: 1;
  min-height: 0;
}

/* El B1 ocupa toda la fila superior */
.chart-b1 {
  grid-column: 1 / -1;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px; /* Más sobrio */
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chart-header {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.chart-card h4 {
  margin: 0 0 2px 0;
  color: #334155;
  font-size: 1rem;
  font-weight: 600;
}

.chart-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.chart-container {
  flex-grow: 1;
  min-height: 0;
  position: relative;
}

.no-data-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-grow: 1;
  color: #94a3b8;
  font-size: 0.85rem;
  text-align: center;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
}

.no-data-icon {
  font-size: 1.5rem;
}

.estado-carga {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(71, 85, 105, 0.1);
  border-top-color: #475569;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    display: flex;
    flex-direction: column;
  }
  .chart-card {
    height: 300px;
    flex-shrink: 0;
  }
}
</style>
