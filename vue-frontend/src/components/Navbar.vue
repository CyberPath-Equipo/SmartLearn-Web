<template>
  <header class="dashboard-header" role="banner">
      <div class="dashboard-header-left">
          <button class="boton-imagen" aria-label="Ir a página principal" @click="$router.push('/')"> 
              <img src="/images/Blanco_sin_fondo_Recortada_Smart_Learn_logo.png" alt="imagen SL" width="87" height="60">
          </button>
          <h1 id="pageTitle">Panel Administrativo</h1>
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
