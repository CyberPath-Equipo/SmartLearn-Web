<template>
  <header class="dashboard-header" role="banner">
      <div class="dashboard-header-left">
          <button class="boton-imagen" aria-label="Ir a página principal" @click="$router.push('/dashboard')"> 
              <img src="/images/Blanco_sin_fondo_Recortada_Smart_Learn_logo.png" alt="imagen SL" width="87" height="60">
          </button>
          <h1 id="pageTitle" class="desktop-only">Panel Administrativo</h1>
          <!-- Botón Volver integrado en el Navbar -->
          <button 
            v-if="$route.path !== '/dashboard'" 
            class="btn-nav-volver" 
            @click="$router.back()"
          >
            ← Volver
          </button>
      </div>
      <div class="dashboard-header-right">
          <button class="boton-imagen profile-btn" aria-label="Ir al perfil de usuario" @click="$router.push('/usuario')"> 
              <img src="/images/perfilUsuarioSinFondo.png" alt="Perfil del usuario" height="50">
          </button>
          <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
      </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  color: white;
  height: 80px; /* Altura fija para consistencia */
}

.dashboard-header-left, .dashboard-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

#pageTitle {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.btn-nav-volver {
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-nav-volver:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-3px);
}

.btn-logout {
  background: transparent;
  border: 1.5px solid white;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .dashboard-header {
    padding: 10px 15px;
  }
}
</style>
