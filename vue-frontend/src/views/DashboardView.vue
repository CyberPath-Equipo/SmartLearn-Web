<template>
  <div class="content-view">
    <div class="breadcrumbs">
      <span class="breadcrumb-item active">Dashboard Principal</span>
    </div>
    
    <div class="topbar">
      <div>
        <h2 class="view-title">Dashboard General Docente</h2>
        <p class="view-subtitle">Métricas y estadísticas globales de tu actividad académica.</p>
      </div>
    </div>

    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Procesando estadísticas...</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Dashboard A1: Tarjetas de Materias -->
      <section class="dashboard-section" style="grid-column: 1 / -1;">
        <h3>Resumen por Materia</h3>
        <div class="cards-grid">
          <div v-for="(mat, idx) in materiasStats" :key="mat.id" class="stat-card" :style="{ background: getGradient(idx) }">
            <h4 class="materia-title">{{ mat.nombre }}</h4>
            <div class="materia-metrics">
              <div class="metric">
                <span class="metric-value">{{ mat.alumnosInscritos }}</span>
                <span class="metric-label">Alumnos</span>
              </div>
              <div class="metric">
                <span class="metric-value">{{ mat.progresoPromedio }}%</span>
                <span class="metric-label">Progreso Medio</span>
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
        <apexchart type="line" height="350" :options="chartA2Options" :series="chartA2Series"></apexchart>
      </section>

      <!-- Dashboard A3: Temas Más Activos -->
      <section class="dashboard-section chart-card">
        <h3>Temas con Más Actividad</h3>
        <apexchart type="bar" height="350" :options="chartA3Options" :series="chartA3Series"></apexchart>
      </section>

      <!-- Dashboard A4: Usuarios Activos vs Inactivos -->
      <section class="dashboard-section chart-card">
        <h3>Estado de Usuarios</h3>
        <apexchart type="donut" height="350" :options="chartA4Options" :series="chartA4Series"></apexchart>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const authStore = useAuthStore();
const idUsuario = authStore.user?.idUsuario;

const cargando = ref(true);

// Datos procesados para A1
const materiasStats = ref([]);

// Datos para A2
const chartA2Series = ref([]);
const chartA2Options = ref({
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 3 },
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
    // 1. Obtener materias del usuario
    const { data: materiasUser } = await api.get(`/usuario-materia/usuario/${idUsuario}/materias`).catch(() => ({ data: [] }));
    
    // 2. Obtener todas las relaciones usuario-materia y progresos (A1)
    const { data: todosUsuarioMateria } = await api.get(`/usuario-materia`).catch(() => ({ data: [] }));
    const { data: todosProgresos } = await api.get(`/progreso-subtema`).catch(() => ({ data: [] }));
    
    // Obtener temas y subtemas para relacionar progresos con materias
    const { data: todosTemas } = await api.get(`/tema`).catch(() => ({ data: [] }));
    const { data: todosSubtemas } = await api.get(`/subtema`).catch(() => ({ data: [] }));

    // Procesar A1
    materiasStats.value = materiasUser.map(mat => {
      // Alumnos inscritos en esta materia
      const inscritos = todosUsuarioMateria.filter(um => um.idMateria === mat.id).length;
      
      // Progresos de esta materia
      // Buscar temas de la materia
      const temasMateria = todosTemas.filter(t => t.idMateria === mat.id).map(t => t.id);
      // Buscar subtemas de esos temas
      const subtemasMateria = todosSubtemas.filter(s => temasMateria.includes(s.idTema)).map(s => s.id);
      
      // Progresos en esos subtemas
      const progresosMateria = todosProgresos.filter(p => subtemasMateria.includes(p.idSubtema));
      const promProgreso = progresosMateria.length 
        ? progresosMateria.reduce((acc, curr) => acc + curr.porcentaje, 0) / progresosMateria.length 
        : 0;

      return {
        id: mat.id,
        nombre: mat.nombre,
        alumnosInscritos: inscritos,
        progresoPromedio: promProgreso.toFixed(1)
      };
    });

    // 3. Procesar A2 (Contenido Generado)
    const { data: teorias } = await api.get(`/teoria`).catch(() => ({ data: [] }));
    const { data: ejercicios } = await api.get(`/ejercicio`).catch(() => ({ data: [] }));
    
    // Agruparemos por mes usando updated_at para teorias, simularemos para el resto si no hay fecha.
    const mesesMap = {};
    const getMonthLabel = (dateStr) => {
      if (!dateStr) return 'Actual';
      const d = new Date(dateStr);
      if (isNaN(d)) return 'Actual';
      return d.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    teorias.forEach(t => {
      const lbl = getMonthLabel(t.updated_at || t.fechaActualizacion || new Date().toISOString());
      if(!mesesMap[lbl]) mesesMap[lbl] = { teorias: 0, ejercicios: 0 };
      mesesMap[lbl].teorias++;
    });

    ejercicios.forEach(e => {
      const lbl = 'Actual'; // Ejercicios no tienen fecha en DTO según context
      if(!mesesMap[lbl]) mesesMap[lbl] = { teorias: 0, ejercicios: 0 };
      mesesMap[lbl].ejercicios++;
    });

    const labelsA2 = Object.keys(mesesMap);
    chartA2Options.value = { ...chartA2Options.value, xaxis: { categories: labelsA2 } };
    chartA2Series.value = [
      { name: 'Teorías', data: labelsA2.map(lbl => mesesMap[lbl].teorias) },
      { name: 'Ejercicios', data: labelsA2.map(lbl => mesesMap[lbl].ejercicios) }
    ];

    // 4. Procesar A3 (Temas más activos)
    const { data: intentos } = await api.get(`/intento-ejercicio`).catch(() => ({ data: [] }));
    
    // Mapear ejercicio -> subtema -> tema
    const ejDict = {}; ejercicios.forEach(e => ejDict[e.id] = e.idSubtema);
    const subDict = {}; todosSubtemas.forEach(s => subDict[s.id] = s.idTema);
    const temaDict = {}; todosTemas.forEach(t => temaDict[t.id] = t.nombre);

    const temaActivity = {};
    intentos.forEach(intento => {
      const idSub = ejDict[intento.idEjercicio];
      const idTema = subDict[idSub];
      if (idTema) {
        const nombreTema = temaDict[idTema] || `Tema ${idTema}`;
        temaActivity[nombreTema] = (temaActivity[nombreTema] || 0) + 1;
      }
    });

    const sortedTemas = Object.entries(temaActivity).sort((a,b) => b[1] - a[1]).slice(0, 5);
    chartA3Options.value = { ...chartA3Options.value, xaxis: { categories: sortedTemas.map(t => t[0]) } };
    chartA3Series.value = [{ name: 'Intentos', data: sortedTemas.map(t => t[1]) }];

    // 5. Procesar A4 (Usuarios Activos vs Inactivos)
    const { data: conexiones } = await api.get(`/ultima-conexion`).catch(() => ({ data: [] }));
    
    // Asumir que cada registro es un usuario o debemos agrupar por usuario
    // Agrupar por idUsuario para obtener la más reciente
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

    // Si no hay datos, mostrar algo por defecto
    if(activos === 0 && inactivos === 0) { activos = 1; inactivos = 0; }
    chartA4Series.value = [activos, inactivos];

  } catch (error) {
    console.error("Error cargando dashboard general", error);
  } finally {
    cargando.value = false;
  }
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
  font-size: 1.2rem;
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
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
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
