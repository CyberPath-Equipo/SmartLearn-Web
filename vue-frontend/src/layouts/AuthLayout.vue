<template>
  <div class="auth-layout-container">
    <header id="main-header" class="header-top" role="banner">
      <h1 id="pageTitle">Smart Learn</h1>
      <p class="subtitle">Plataforma Educativa</p>
      <button @click="volverSL" class="btn-ghost">Volver a SL</button>
    </header>

    <main class="auth-main">
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
                <p><a href="#">Aviso de privacidad</a></p>
                <p><a href="#">¿Qué es Smart Learn?</a></p>
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
<style scoped>
.auth-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.auth-main {
  flex: 1;
}
</style>
<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const volverSL = () => {
    router.push('/smartlearn')
}

</script>
