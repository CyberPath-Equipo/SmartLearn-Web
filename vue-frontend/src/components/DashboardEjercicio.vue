<template>
  <div class="dashboard-ejercicio-container">
    <div class="dashboard-header">
      <h3>Analítica del Ejercicio</h3>
      <p>Métricas de desempeño y comportamiento de los alumnos en este ejercicio.</p>
    </div>

    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando datos del ejercicio...</p>
    </div>

    <div v-else-if="noData" class="no-data-msg">
      <span class="no-data-icon">📊</span>
      <span>Datos insuficientes o inexistentes.<br>Se necesitan al menos 3 intentos para mostrar estadísticas.</span>
    </div>

    <div v-else class="dashboard-grid">
      <!-- C1: Tiempo Promedio vs Puntaje Promedio -->
      <div class="chart-card">
        <h4>Tiempo Promedio vs Puntaje Promedio</h4>
        <p class="chart-desc">Comportamiento general de los alumnos en el ejercicio.</p>
        <apexchart type="bar" height="280" :options="chartC1Options" :series="chartC1Series"></apexchart>
        <div class="interpretacion" v-if="interpretacion">
          <span class="interp-icon">💡</span>
          <span>{{ interpretacion }}</span>
        </div>
      </div>

      <!-- C2: Estado de Intentos -->
      <div class="chart-card donut-card">
        <h4>Estado de los Intentos</h4>
        <p class="chart-desc">Proporción de alumnos que completaron o abandonaron el ejercicio.</p>
        <apexchart type="donut" height="280" :options="chartC2Options" :series="chartC2Series"></apexchart>
      </div>
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
const interpretacion = ref('');

// --- C1: Tiempo Promedio vs Puntaje Promedio ---
const chartC1Series = ref([]);
const chartC1Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '40%',
      distributed: true
    }
  },
  xaxis: {
    categories: ['Tiempo Promedio (seg)', 'Puntaje Promedio (%)']
  },
  colors: ['#06b6d4', '#10b981'],
  legend: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => {
      // Mostrar unidad según la categoría
      return opts.dataPointIndex === 0 ? val.toFixed(0) + ' seg' : val.toFixed(1) + '%';
    }
  },
  tooltip: {
    y: {
      formatter: (val, opts) =>
        opts?.dataPointIndex === 0 ? val.toFixed(0) + ' segundos' : val.toFixed(1) + '%'
    }
  },
  yaxis: { max: undefined } // Se ajusta dinámicamente
});

// --- C2: Estado de Intentos (Donut) ---
const chartC2Series = ref([]);
const chartC2Options = ref({
  chart: { type: 'donut' },
  labels: ['Completados', 'Abandonados'],
  colors: ['#10b981', '#ef4444'],
  legend: { position: 'bottom' },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + '%'
  },
  tooltip: {
    y: { formatter: (val) => val + ' intentos' }
  }
});

// --- Lógica de interpretación para C1 ---
function calcularInterpretacion(tiempoPromedio, puntajePromedio) {
  const tiempoAlto = tiempoPromedio > 120; // más de 2 minutos
  const puntajeAlto = puntajePromedio >= 70;

  if (tiempoAlto && puntajeAlto)  return 'Ejercicio difícil pero alcanzable: los alumnos tardan bastante pero logran buenos resultados.';
  if (tiempoAlto && !puntajeAlto) return 'Ejercicio problemático: los alumnos invierten mucho tiempo sin obtener buenos resultados. Considera revisarlo.';
  if (!tiempoAlto && puntajeAlto) return 'Ejercicio sencillo: los alumnos lo resuelven rápidamente con buenos resultados.';
  return 'Posible abandono o falta de comprensión: poco tiempo y bajo puntaje. Revisa la claridad del ejercicio.';
}

async function cargarEstadisticasEjercicio() {
  if (!props.idEjercicio) return;
  cargando.value = true;
  noData.value = false;
  interpretacion.value = '';

  try {
    let intentos = [];
    try {
      const res = await api.get('/intento-ejercicio/{idEjercicio}', {
        params: { idEjercicio: props.idEjercicio }
      });
      intentos = res.data || [];
    } catch (e) {
      if (e.response?.status === 404) {
        noData.value = true;
        return;
      }
    }

    // Filtrar por el ejercicio actual
    const intentosEjercicio = intentos.filter(
      i => String(i.idEjercicio) === String(props.idEjercicio)
    );

    // Mínimo 3 intentos válidos para mostrar estadísticas
    if (intentosValidos.length < 3) {
      noData.value = true;
      return;
    }

    // ===== C1: Tiempo Promedio vs Puntaje Promedio =====
    const tiempoPromedio =
      intentosValidos.reduce((acc, i) => acc + (i.duracionSeg || 0), 0) / intentosValidos.length;

    const puntajePromedio =
      intentosValidos.reduce((acc, i) => acc + (i.puntaje || 0), 0) / intentosValidos.length;

    // Ajustar el eje Y al mayor valor para mejor visualización
    const maxVal = Math.max(tiempoPromedio, puntajePromedio, 100) * 1.15;
    chartC1Options.value = {
      ...chartC1Options.value,
      yaxis: { max: Math.ceil(maxVal) }
    };

    chartC1Series.value = [{
      name: 'Promedio',
      data: [parseFloat(tiempoPromedio.toFixed(1)), parseFloat(puntajePromedio.toFixed(1))]
    }];

    interpretacion.value = calcularInterpretacion(tiempoPromedio, puntajePromedio);

    // ===== C2: Estado de Intentos =====
    const completados = intentosEjercicio.filter(
      i => i.estado?.toUpperCase() === 'COMPLETADO'
    ).length;

    const abandonados = intentosEjercicio.filter(
      i => i.estado?.toUpperCase() === 'ABANDONADO'
    ).length;

    // Solo mostrar donut si hay al menos un intento con estado definido
    const totalConEstado = completados + abandonados;
    chartC2Series.value = totalConEstado > 0
      ? [completados, abandonados]
      : [intentosEjercicio.length, 0]; // Si no hay estado definido, todos como completados

  } catch (error) {
    console.error('Error cargando estadísticas del ejercicio', error);
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

.donut-card {
  display: flex;
  flex-direction: column;
}

.chart-card h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 700;
}

.chart-desc {
  font-size: 0.85rem;
  color: #718096;
  margin: 0 0 16px 0;
}

.interpretacion {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #1e40af;
  line-height: 1.5;
}

.interp-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.no-data-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: #a0aec0;
  font-size: 0.95rem;
  text-align: center;
  background: #f1f5f9;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.no-data-icon {
  font-size: 2.2rem;
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
  border: 3px solid rgba(6, 182, 212, 0.15);
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
