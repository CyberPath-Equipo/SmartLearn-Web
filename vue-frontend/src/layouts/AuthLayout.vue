<template>
  <div class="auth-layout-container auth-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <header id="main-header" class="header-top" role="banner">
      <button type="button" class="auth-header-brand" @click="volverSL" aria-label="Volver a la página principal de Smart Learn">
        <div class="navbar-logo">
          <img src="/images/Blanco_sin_fondo_Smart_Learn_logo.png" alt="Logo de Smart Learn" height="44">
        </div>
        <div class="brand-text">
          <h1 id="pageTitle">Smart Learn</h1>
          <p class="subtitle">Plataforma Educativa Accesible</p>
        </div>
      </button>
      <button @click="volverSL" class="btn-ghost">
        <svg class="sl-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="/smartlearn-icons.svg#arrow-left" /></svg>
        <span>Volver a Inicio</span>
      </button>
    </header>

    <main id="main-content" class="auth-main" role="main" tabindex="-1">
      <router-view></router-view>
    </main>

    <FooterPrincipal />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import FooterPrincipal from '../components/FooterPrincipal.vue';

const router = useRouter();

const volverSL = () => {
  router.push('/smartlearn');
};
</script>

<style scoped>
.auth-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.auth-main {
  flex: 1;
}
.auth-header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  padding: 0;
}
</style>
