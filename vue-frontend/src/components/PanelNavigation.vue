<template>
  <nav class="panel-navigation" aria-label="Navegación del panel">
    <div class="panel-navigation-inner">
      <router-link to="/dashboard" class="panel-navigation-link">
        Dashboard
      </router-link>
      <router-link
        v-if="authStore.isDocente || authStore.isAdmin"
        to="/materias"
        :class="['panel-navigation-link', { active: isSectionActive('materias') }]"
      >
        Materias
      </router-link>
      <router-link
        v-if="authStore.isDocente || authStore.isAdmin"
        to="/ejercicio"
        :class="['panel-navigation-link', { active: isSectionActive('ejercicios') }]"
      >
        Ejercicios
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

const sectionRoutes = {
  materias: ['materias', 'tema', 'subtema', 'teoria'],
  ejercicios: ['ejercicio', 'crear-ejercicio', 'crear-preguntas', 'editar-ejercicio', 'editar-pregunta']
};

function isSectionActive(section) {
  return sectionRoutes[section]?.includes(route.name);
}
</script>

<style scoped>
.panel-navigation {
  padding: 8px 40px;
  background: #ffffff;
  border-bottom: 1px solid #edf2f7;
}

.panel-navigation-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.panel-navigation-link {
  color: #4a5568;
  text-decoration: none;
  padding: 9px 14px;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.panel-navigation-link:hover {
  color: #2563eb;
  background: #edf4ff;
}

.panel-navigation-link.router-link-exact-active,
.panel-navigation-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2);
}

@media (max-width: 700px) {
  .panel-navigation {
    padding: 8px 16px;
  }

  .panel-navigation-inner {
    justify-content: center;
  }

  .panel-navigation-link {
    flex: 1 1 auto;
    text-align: center;
  }
}
</style>
