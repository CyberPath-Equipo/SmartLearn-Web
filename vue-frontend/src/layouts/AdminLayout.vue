<template>
  <div class="admin-layout-container">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <Navbar />

    <PanelNavigation v-if="authStore.isAuthenticated" />
    
    <main id="main-content" role="main" tabindex="-1">
      <router-view></router-view>
    </main>

    <FooterPrincipal />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import PanelNavigation from '../components/PanelNavigation.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.admin-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
</style>
