<template>
  <div class="dashboard-ejercicio-container">
    <div class="dashboard-header">
      <h3>Análisis de Rendimiento (Tiempo vs Aciertos)</h3>
      <p>Explora la relación entre el tiempo que los alumnos tardan en contestar y su puntaje obtenido.</p>
    </div>

    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando datos del ejercicio...</p>
    </div>

    <div v-else-if="noData" class="no-data-chart">Datos insuficientes o inexistentes.</div>

    <div v-else class="chart-card">
      <apexchart type="scatter" height="350" :options="chartC1Options" :series="chartC1Series"></apexchart>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../api/axios';

const props = defineProps({
  idEjercicio: {
    type: [Number, String],
    required: true
  }
});

const cargando = ref(true);
const noData = ref(false);

const chartC1Series = ref([{ name: 'Intentos', data: [] }]);
const chartC1Options = ref({
  chart: {
    type: 'scatter',
    zoom: { type: 'xy' },
    toolbar: { show: false }
  },
  xaxis: {
    title: { text: 'Duración (Segundos)' },
    tickAmount: 10,
    labels: { formatter: (val) => parseFloat(val).toFixed(0) }
  },
  yaxis: {
    title: { text: 'Puntaje (%)' },
    max: 100,
    min: 0
  },
  colors: ['#06b6d4'],
  markers: { size: 6, strokeWidth: 1, strokeColors: '#ffffff' },
  tooltip: {
    x: { formatter: (val) => val + ' seg' },
    y: { formatter: (val) => val + '%' }
  }
});

async function cargarEstadisticasEjercicio() {
  if (!props.idEjercicio) return;
  cargando.value = true;
  try {
    let intentos = [];
    try { const res = await api.get('/intento-ejercicio'); intentos = res.data || []; } catch (e) { if (e.response?.status === 404) { noData.value = true; return; } }
    
    // Filtrar para el ejercicio actual
    const intentosEjercicio = intentos.filter(i => String(i.idEjercicio) === String(props.idEjercicio));
    
    // Mapear a formato Scatter: { x: duracionSeg, y: puntaje }
    const datosScatter = intentosEjercicio.map(i => {
      return [i.duracionSeg || 0, i.puntaje || 0];
    });

    chartC1Series.value = [{
      name: 'Intentos',
      data: datosScatter
    }];

  } catch (error) {
    console.error("Error cargando estadisticas del ejercicio", error);
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarEstadisticasEjercicio);
watch(() => props.idEjercicio, cargarEstadisticasEjercicio);
</script>

<style scoped>
.dashboard-ejercicio-container {
  margin-top: 32px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.dashboard-header p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
