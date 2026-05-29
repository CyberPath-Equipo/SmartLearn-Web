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

    <div v-else-if="noData" class="no-data-chart">Datos insuficientes o inexistentes.</div>

    <div v-else class="dashboard-grid">
      <!-- B1: Ejercicios con más errores -->
      <div class="chart-card">
        <h4>Ejercicios Problemáticos</h4>
        <p class="chart-desc">Ejercicios con mayor tasa de error o abandono.</p>
        <apexchart type="bar" height="250" :options="chartB1Options" :series="chartB1Series"></apexchart>
      </div>

      <!-- B2: Temas más activos -->
      <div class="chart-card">
        <h4>Actividad por Tema</h4>
        <p class="chart-desc">Cantidad de intentos realizados por los alumnos.</p>
        <apexchart type="bar" height="250" :options="chartB2Options" :series="chartB2Series"></apexchart>
      </div>

      <!-- B3: Progreso promedio -->
      <div class="chart-card radial-card">
        <h4>Avance Global</h4>
        <p class="chart-desc">Progreso promedio de los alumnos en la materia.</p>
        <apexchart type="radialBar" height="280" :options="chartB3Options" :series="chartB3Series"></apexchart>
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
const noData = ref(false);

const chartB1Series = ref([{ name: 'Tasa de Error (%)', data: [] }]);
const chartB1Options = ref({
  chart: { 
    type: 'bar', 
    toolbar: { show: false },
    events: {
      dataPointSelection: (event, chartContext, config) => {
        const index = config.dataPointIndex;
        if(index >= 0 && idEjerciciosMap.value[index]) {
          // Navegar al ejercicio
          // Nota: Sería necesario contar con idSubtema etc, pero a falta de ellos, se puede ir a ver ejercicio general.
        }
      }
    }
  },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, colors: { ranges: [{ from: 0, to: 100, color: '#ef4444' }] } } },
  xaxis: { categories: [], max: 100 },
  tooltip: {
    y: { formatter: (val) => val.toFixed(1) + '%' }
  }
});
const idEjerciciosMap = ref({});

const chartB2Series = ref([{ name: 'Intentos', data: [] }]);
const chartB2Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: [] },
  colors: ['#3b82f6']
});

const chartB3Series = ref([0]);
const chartB3Options = ref({
  chart: { type: 'radialBar' },
  plotOptions: {
    radialBar: {
      hollow: { size: '65%' },
      dataLabels: {
        name: { show: false },
        value: { fontSize: '2rem', fontWeight: 700, color: '#10b981', formatter: (val) => val.toFixed(1) + '%' }
      }
    }
  },
  colors: ['#10b981'],
  stroke: { lineCap: 'round' }
});

async function cargarEstadisticasMateria() {
  if (!props.idMateria) return;
  cargando.value = true;
  try {
    let todosTemas = [];
    let todosSubtemas = [];
    let todosEjercicios = [];
    let intentos = [];
    let progresos = [];

    try { const res = await api.get('/tema'); todosTemas = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }
    try { const res = await api.get('/subtema'); todosSubtemas = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }
    try { const res = await api.get('/ejercicio'); todosEjercicios = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }
    try { const res = await api.get('/intento-ejercicio'); intentos = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }
    try { const res = await api.get('/progreso-subtema'); progresos = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }

    const temasMateria = todosTemas.filter(t => String(t.idMateria) === String(props.idMateria));
    const idsTemasMateria = temasMateria.map(t => t.id);
    
    const subtemasMateria = todosSubtemas.filter(s => idsTemasMateria.includes(s.idTema));
    const idsSubtemasMateria = subtemasMateria.map(s => s.id);

    const ejerciciosMateria = todosEjercicios.filter(e => idsSubtemasMateria.includes(e.idSubtema));
    const idsEjerciciosMateria = ejerciciosMateria.map(e => e.id);

    // B1: Ejercicios con más errores (puntaje < 70 o estado abandonado)
    const statsEjercicios = {};
    ejerciciosMateria.forEach(e => statsEjercicios[e.id] = { nombre: e.nombre, intentos: 0, errores: 0 });

    const intentosMateria = intentos.filter(i => idsEjerciciosMateria.includes(i.idEjercicio));
    intentosMateria.forEach(i => {
      if(statsEjercicios[i.idEjercicio]) {
        statsEjercicios[i.idEjercicio].intentos++;
        // Definición de error acordada: puntaje < 70 o estado 'abandonado' (insensible a mayúsculas)
        const estadoLower = (i.estado || '').toLowerCase();
        if (i.puntaje < 70 || estadoLower === 'abandonado') {
          statsEjercicios[i.idEjercicio].errores++;
        }
      }
    });

    const errorRates = Object.entries(statsEjercicios)
      .filter(([id, data]) => data.intentos > 0)
      .map(([id, data]) => {
        return { 
          id, 
          nombre: data.nombre, 
          tasa: (data.errores / data.intentos) * 100 
        };
      })
      .sort((a,b) => b.tasa - a.tasa)
      .slice(0, 5); // Top 5 problemáticos

    chartB1Options.value = { ...chartB1Options.value, xaxis: { ...chartB1Options.value.xaxis, categories: errorRates.map(er => er.nombre) } };
    chartB1Series.value = [{ name: 'Tasa de Error (%)', data: errorRates.map(er => er.tasa) }];
    errorRates.forEach((er, idx) => { idEjerciciosMap.value[idx] = er.id; });

    // B2: Temas más activos
    const actividadTemas = {};
    temasMateria.forEach(t => actividadTemas[t.id] = { nombre: t.nombre, intentos: 0 });

    const subDict = {}; subtemasMateria.forEach(s => subDict[s.id] = s.idTema);
    const ejDict = {}; ejerciciosMateria.forEach(e => ejDict[e.id] = e.idSubtema);

    intentosMateria.forEach(i => {
      const idSub = ejDict[i.idEjercicio];
      const idTema = subDict[idSub];
      if(idTema && actividadTemas[idTema]) {
        actividadTemas[idTema].intentos++;
      }
    });

    const sortedTemas = Object.values(actividadTemas).sort((a,b) => b.intentos - a.intentos).slice(0, 5);
    chartB2Options.value = { ...chartB2Options.value, xaxis: { categories: sortedTemas.map(t => t.nombre) } };
    chartB2Series.value = [{ name: 'Intentos', data: sortedTemas.map(t => t.intentos) }];

    // B3: Progreso promedio
    const progresosMateria = progresos.filter(p => idsSubtemasMateria.includes(p.idSubtema));
    const promProgreso = progresosMateria.length 
      ? progresosMateria.reduce((acc, curr) => acc + curr.porcentaje, 0) / progresosMateria.length 
      : 0;
    
    chartB3Series.value = [promProgreso];

  } catch (error) {
    console.error("Error calculando estadisticas de la materia", error);
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
  color: #718096;
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

.radial-card {
  display: flex;
  flex-direction: column;
  align-items: center;
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
