<template>
  <div class="auth-layout-container">
    <header id="main-header" class="public-header" :class="{ scrolled: isScrolled, 'menu-open': menuOpen, 'keyboard-navigation': keyboardNavigation }"
      @keydown="keyboardNavigation = true" @pointerdown="keyboardNavigation = false"
      @keydown.esc="closeMenu" @focusout="handleFocusOut">
      <div class="header-top">
        <div class="navbar-logo">
          <img src="/images/Blanco_sin_fondo_Smart_Learn_logo.png" alt="Logo de Smart Learn" height="80">
        </div>
        <div class="brand-text">
          <h1 class="title">Smart Learn</h1>
          <span class="subtitle">Potenciando tu aprendizaje</span>
        </div>
      </div>

      <button ref="menuButton" class="menu-toggle" type="button" :aria-expanded="menuOpen"
        aria-controls="navegacion" :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>
      <nav id="navegacion" role="navigation" aria-label="Navegación principal">
         <ul>
           <li class="nav-about"><router-link to="/smartlearn" @click="menuOpen = false">Sobre Smart Learn</router-link></li>
           <li class="nav-mobile"><router-link to="/smartlearn/movil" @click="menuOpen = false"><svg class="sl-icon" aria-hidden="true"><use href="/smartlearn-icons.svg#phone" /></svg>Sobre Smart Learn Móvil</router-link></li>
           <li class="nav-login"><router-link to="/login" @click="menuOpen = false"><svg class="sl-icon" aria-hidden="true"><use href="/smartlearn-icons.svg#login" /></svg>Inicio de sesión</router-link></li>
           <li class="nav-register"><router-link to="/registro" @click="menuOpen = false"><svg class="sl-icon" aria-hidden="true"><use href="/smartlearn-icons.svg#user" /></svg>Registro de usuario</router-link></li>
         </ul>
       </nav>
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
          <p><a href="/privacidad">Aviso de privacidad</a></p>
          <p><a router-link to="/smartlearn">¿Qué es Smart Learn?</a></p>
        </div>
        <div class="footer-col">
          <p><strong>Redes Sociales</strong></p>
          <div class="social-icons">
            <a href="https://instagram.com/cyberpath_oficial/" target="_blank">
              <img src="/images/icon_instagram.png" width="50" alt="Instagram">
            </a>
            <a href="https://www.youtube.com/@CyberPath_oficial" target="_blank">
              <img src="/images/icon_youtube.png" width="70" alt="YouTube">
            </a>
          </div>
        </div>
      </div>
      <p class="footer-copy">Hecho en México · SmartLearn · CyberPath S.A.S.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Presentation state for the responsive navigation disclosure.
const menuOpen = ref(false);
const menuButton = ref(null);
const keyboardNavigation = ref(false);
const closeMenu = () => {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  menuButton.value?.focus();
};
const handleFocusOut = (event) => {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
    menuOpen.value = false;
  }
};

const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
  @import '../assets/styles/global-styles.css';

  .header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 10px 0;
  }

  .brand-text {
    display: flex;
    align-items: baseline;
    gap: 15px;
  }

  .title {
    font-size: 2.8rem;
    font-weight: bold;
    color: white;
    margin: 0;
  }

  .subtitle {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    white-space: nowrap;
  }

  #main-header.scrolled .title {
    font-size: 2rem;
    transition: all 0.3s ease;
  }
  
  #main-header.scrolled .subtitle {
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }
</style>
