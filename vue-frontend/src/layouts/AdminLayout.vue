<template>
  <div class="admin-layout-container">
    <Navbar />
    
    <nav class="admin-nav" v-if="authStore.isAuthenticated">
      <ul class="admin-menu">
        <li><router-link to="/">Dashboard</router-link></li>
        
        <!-- Módulos para DOCENTES -->
        <li v-if="authStore.isDocente || authStore.isAdmin"><router-link to="/materias">Materias</router-link></li>
        <li v-if="authStore.isDocente || authStore.isAdmin"><router-link to="/ejercicio">Ejercicios</router-link></li>
        
        <!-- Módulos exclusivos para ADMIN -->
        <li v-if="authStore.isAdmin"><router-link to="/usuario">Usuarios</router-link></li>
      </ul>
    </nav>
    
    <main role="main">
        <router-view></router-view>
    </main>

    <footer role="contentinfo">
        <div class="footer-content">
            <div class="footer-col">
                <h3>CyberPath S.A.S.</h3>
                <p>Desarrollado por <i>CyberPath</i> &copy; 2026</p>
                <p><a href="mailto:cyberpathcontacto@gmail.com">cyberpathcontacto@gmail.com</a></p>
            </div>
            <div class="footer-col">
                <h3>Recursos</h3>
                <p><router-link to="/privacidad">Aviso de privacidad</router-link></p>
                <p><router-link to="/smartlearn">¿Qué es Smart Learn?</router-link></p>
            </div>
            <div class="footer-col">
                <p><strong>Redes Sociales</strong></p>
                <div class="social-icons">
                    <a href="https://instagram.com/cyberpath_oficial/" target="_blank" aria-label="Síguenos en Instagram">
                        <img src="/images/icon_instagram.png" width="50" alt="Logo de Instagram">
                    </a>
                    <a href="https://www.youtube.com/@CyberPath_oficial" target="_blank" aria-label="Visita nuestro canal de YouTube">
                        <img src="/images/icon_youtube.png" width="70" alt="Logo de YouTube">
                    </a>
                </div>
            </div>
        </div>
        <p class="footer-copy">Hecho en México · Smart Learn · CyberPath S.A.S.</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
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
.admin-nav {
  background-color: white;
  border-bottom: 1px solid #edf2f7;
  padding: 0 40px;
  display: flex;
  align-items: center;
}

.admin-menu {
  list-style: none;
  display: flex;
  gap: 32px;
}

.admin-menu li a {
  text-decoration: none;
  color: #718096;
  font-weight: 500;
  padding: 16px 4px;
  display: inline-block;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.admin-menu li a:hover {
  color: #2d3748;
}

.admin-menu li a.router-link-exact-active {
  color: #4a90e2;
  border-bottom: 2px solid #4a90e2;
  background-color: transparent;
}
</style>
