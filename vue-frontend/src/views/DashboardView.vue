<template>
  <div class="content-view">    
    <div class="topbar">
      <div>
        <h2 class="view-title">Dashboard General</h2>
        <p class="view-subtitle">Métricas y estadísticas globales de tus recursos académicos.</p>
      </div>
    </div>

    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Procesando estadísticas...</p>
    </div>

    <div v-else-if="noDataGeneral" class="no-data-chart">Datos insuficientes o inexistentes.</div>

    <div v-else class="dashboard-grid">
      <!-- Dashboard A1: Tarjetas de Materias -->
      <section class="dashboard-section" style="grid-column: 1 / -1;">
        <h3>Tus materias</h3>
        <div class="cards-grid">
          <div v-for="(mat, idx) in materiasStats" :key="mat.id" class="stat-card stat-card-clickable" :style="{ background: getGradient(idx) }" @click="irAMateria(mat)">
            <h4 class="materia-title">{{ mat.nombre }}</h4>
            <div class="materia-metrics">
              <div class="metric">
                <span class="metric-value">{{ mat.alumnosInscritos }}</span>
                <span class="metric-label">Alumnos</span>
              </div>
              <div class="metric">
                <span class="metric-value">{{ mat.totalTemas }}</span>
                <span class="metric-label">Temas</span>
              </div>
            </div>
          </div>
          <div v-if="materiasStats.length === 0" class="no-data">
            No tienes materias registradas o con datos suficientes.
          </div>
        </div>
      </section>

      <!-- Dashboard A2: Contenido Académico Generado -->
      <section class="dashboard-section chart-card">
        <h3>Contenido Generado (Últimos Meses)</h3>
        <div v-if="noDataA2" class="no-data-chart">No hay contenido generado aún.</div>
        <apexchart v-else type="line" height="350" :options="chartA2Options" :series="chartA2Series"></apexchart>
      </section>

      <!-- Dashboard A3: Temas Más Activos -->
      <section class="dashboard-section chart-card">
        <h3>Temas con Más Actividad</h3>
        <div v-if="noDataA3" class="no-data-chart">No hay intentos de ejercicios aún.</div>
        <apexchart v-else type="bar" height="350" :options="chartA3Options" :series="chartA3Series"></apexchart>
      </section>

      <!-- Dashboard A4: Usuarios Activos vs Inactivos -->
      <section class="dashboard-section chart-card">
        <h3>Estado de Usuarios</h3>
        <div v-if="noDataA4" class="no-data-chart">No hay datos de conexión de usuarios aún.</div>
        <apexchart v-else type="donut" height="350" :options="chartA4Options" :series="chartA4Series"></apexchart>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const authStore = useAuthStore();
const idUsuario = authStore.user?.idUsuario;

const cargando = ref(true);
const noDataA2 = ref(false); // ahora significa "sin recursos por materia"
const noDataA3 = ref(false);
const noDataA4 = ref(false);
const noDataGeneral = ref(false);

// Datos procesados para A1
const materiasStats = ref([]);

// Datos para A2 (Distribución por materia)
const chartA2Series = ref([]);
const chartA2Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
  xaxis: { categories: [] },
  colors: ['#2563eb', '#10b981', '#f59e0b'],
  legend: { position: 'top' },
  theme: { mode: 'light' }
});

// Datos para A3
const chartA3Series = ref([{ name: 'Intentos', data: [] }]);
const chartA3Options = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  xaxis: { categories: [] },
  colors: ['#8b5cf6']
});

// Datos para A4
const chartA4Series = ref([]);
const chartA4Options = ref({
  chart: { type: 'donut' },
  labels: ['Activos (< 7 días)', 'Inactivos (> 7 días)'],
  colors: ['#10b981', '#ef4444'],
  legend: { position: 'bottom' }
});

const gradients = [
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #10b981, #047857)',
  'linear-gradient(135deg, #8b5cf6, #5b21b6)',
  'linear-gradient(135deg, #ec4899, #be185d)'
];
const getGradient = (index) => gradients[index % gradients.length];

async function cargarDatosGenerales() {
  cargando.value = true;
  try {
    // 1. Obtener materias del docente
    const { data: materiasUser } = await api.get(`/usuario-materia/usuario/${idUsuario}/materias`).catch(() => ({ data: [] }));

    // Obtener todas las relaciones usuario-materia (para contar alumnos inscritos)
    const { data: todosUsuarioMateria } = await api.get(`/usuario-materia`).catch(() => ({ data: [] }));

    // Mapeos auxiliares para A2/A3
    const ejToSubtema = {}; // ejercicio.id -> subtemaId
    const subToTema = {}; // subtema.id -> temaId
    const temaIdToNombre = {}; // temaId -> nombre

    const materiasStatsTemp = [];

    // Variables para la gráfica A2
    const nombresMaterias = [];
    const temasPorMateria = [];
    const teoriasPorMateria = [];
    const ejerciciosPorMateria = [];

    // Recorremos materias y contamos temas, teorías y ejercicios por materia
    for (const mat of materiasUser) {
      nombresMaterias.push(mat.nombre || `Materia ${mat.id}`);

      // Contar alumnos inscritos (fallback: filtrar por relaciones)
      const inscritos = todosUsuarioMateria.filter(um => um.idMateria === mat.id).length;

      // Temas de la materia
      const { data: temasMateria } = await api.get(`/materia/${mat.id}/temas`).catch(() => ({ data: [] }));
      const totalTemas = temasMateria.length;

      let totalTeorias = 0;
      let totalEjercicios = 0;

      for (const tema of temasMateria) {
        temaIdToNombre[tema.id] = tema.nombre || tema.titulo || `Tema ${tema.id}`;

        // Subtemas del tema
        const { data: subtemas } = await api.get(`/tema/${tema.id}/subtemas`).catch(() => ({ data: [] }));

        for (const sub of subtemas) {
          subToTema[sub.id] = tema.id;

          // Teorías del subtema
          const { data: teorias } = await api.get(`/subetema/${sub.id}/teoria`).catch(() => ({ data: [] }));
          totalTeorias += teorias.length;

          // Ejercicios del subtema
          const { data: ejercicios } = await api.get(`/subetema/${sub.id}/ejercicio`).catch(() => ({ data: [] }));
          totalEjercicios += ejercicios.length;

          // Mapear ejercicios a subtema para A3
          ejercicios.forEach(e => { if (e?.id) ejToSubtema[e.id] = sub.id; });
        }
      }

      materiasStatsTemp.push({
        id: mat.id,
        nombre: mat.nombre,
        alumnosInscritos: inscritos,
        totalTemas: totalTemas
      });

      temasPorMateria.push(totalTemas);
      teoriasPorMateria.push(totalTeorias);
      ejerciciosPorMateria.push(totalEjercicios);
    }

    materiasStats.value = materiasStatsTemp;

    // A2: Distribución de Recursos Académicos por materia
    if (nombresMaterias.length === 0) {
      noDataA2.value = true;
    } else {
      noDataA2.value = temasPorMateria.every(v => v === 0) && teoriasPorMateria.every(v => v === 0) && ejerciciosPorMateria.every(v => v === 0);
      chartA2Options.value = { ...chartA2Options.value, xaxis: { categories: nombresMaterias } };
      chartA2Series.value = [
        { name: 'Temas', data: temasPorMateria },
        { name: 'Teorías', data: teoriasPorMateria },
        { name: 'Ejercicios', data: ejerciciosPorMateria }
      ];
    }

    // A3: Temas con más actividad (usa intentos)
    const { data: intentos } = await api.get(`/intento-ejercicio`).catch(() => ({ data: [] }));
    if ((intentos?.length ?? 0) === 0) {
      noDataA3.value = true;
    } else {
      const temaActivity = {};
      intentos.forEach(intento => {
        const idEj = intento.idEjercicio ?? intento.id_ejercicio ?? intento.ejercicioId;
        const idSub = ejToSubtema[idEj];
        const idTema = idSub ? subToTema[idSub] : null;
        if (idTema) {
          const nombreTema = temaIdToNombre[idTema] || `Tema ${idTema}`;
          temaActivity[nombreTema] = (temaActivity[nombreTema] || 0) + 1;
        }
      });

      const sortedTemas = Object.entries(temaActivity).sort((a,b) => b[1] - a[1]).slice(0, 5);
      if (sortedTemas.length === 0) {
        noDataA3.value = true;
      } else {
        noDataA3.value = false;
        chartA3Options.value = { ...chartA3Options.value, xaxis: { categories: sortedTemas.map(t => t[0]) } };
        chartA3Series.value = [{ name: 'Intentos', data: sortedTemas.map(t => t[1]) }];
      }
    }

    // A4: Usuarios Activos vs Inactivos
    const { data: conexiones } = await api.get(`/ultima-conexion`).catch(() => ({ data: [] }));
    if ((conexiones?.length ?? 0) === 0) {
      noDataA4.value = true;
    } else {
      noDataA4.value = false;
      const userUltimaConexion = {};
      conexiones.forEach(c => {
        if (!userUltimaConexion[c.idUsuario] || new Date(c.ultimaConexion) > new Date(userUltimaConexion[c.idUsuario])) {
          userUltimaConexion[c.idUsuario] = c.ultimaConexion;
        }
      });

      const limiteInactivo = new Date();
      limiteInactivo.setDate(limiteInactivo.getDate() - 7);

      let activos = 0, inactivos = 0;
      Object.values(userUltimaConexion).forEach(fecha => {
        if (new Date(fecha) >= limiteInactivo) activos++;
        else inactivos++;
      });

      if (activos === 0 && inactivos === 0) { activos = 1; inactivos = 0; }
      chartA4Series.value = [activos, inactivos];
    }

    // Determinar si no hay datos relevantes en todo el dashboard
    noDataGeneral.value = (materiasStats.value.length === 0) && noDataA2.value && noDataA3.value && noDataA4.value;

  } catch (error) {
    console.error('Error cargando dashboard general', error);
  } finally {
    cargando.value = false;
  }
}

function irAMateria(materia) {
  const mensaje = `¿Deseas entrar a la materia "${materia.nombre}"?`;
  if (!window.confirm(mensaje)) return;
  router.push({ name: 'tema', params: { idMateria: materia.id, nombreMateria: materia.nombre } });
}

onMounted(() => {
  cargarDatosGenerales();
});
</script>

<style scoped>
.content-view {
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.breadcrumbs {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 8px;
}
.breadcrumb-item.active {
  color: #2d3748;
  font-weight: 600;
}

.view-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 6px 0;
  letter-spacing: -0.025em;
}

.view-subtitle {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.dashboard-section h3 {
  font-size: 1.6rem;
  color: #2d3748;
  margin-bottom: 16px;
  font-weight: 700;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card-clickable {
  cursor: pointer;
}

.no-data-chart {
  padding: 28px 16px;
  text-align: center;
  color: #4a5568;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e0;
  font-weight: 600;
}

.materia-title {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
}

.materia-metrics {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 800;
}

.metric-label {
  font-size: 0.8rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chart-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.estado-carga {
  padding: 60px;
  text-align: center;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
