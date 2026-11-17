<template>
  <div class="auth-layout-container">
    <header id="main-header" class="public-header" :class="{ scrolled: isScrolled, 'menu-open': menuOpen, 'keyboard-navigation': keyboardNavigation }"
      @keydown="keyboardNavigation = true" @pointerdown="keyboardNavigation = false"
      @keydown.esc="closeMenu" @focusout="handleFocusOut">
      <router-link to="/smartlearn" @click="menuOpen = false" class="header-top header-brand-link" aria-label="Smart Learn - Ir al inicio">
        <div class="navbar-logo">
          <img src="/images/Blanco_sin_fondo_Recortada_Smart_Learn_logo.png" alt="Logo de Smart Learn" height="52" width="75">
        </div>
        <div class="brand-text">
          <h1 class="title">Smart Learn</h1>
          <span class="subtitle">Potenciando tu aprendizaje</span>
        </div>
      </router-link>

      <!-- Botón de Menú Móvil: estrictamente oculto en desktop (>1100px) -->
      <button ref="menuButton" class="menu-toggle" type="button" :aria-expanded="menuOpen"
        aria-controls="navegacion" :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>

      <nav id="navegacion" role="navigation" aria-label="Navegación principal">
        <ul>
          <li class="nav-about">
            <router-link to="/smartlearn" @click="menuOpen = false">
              <SlIcon name="book" :size="18" />
              <span>Sobre Smart Learn</span>
            </router-link>
          </li>
          <li class="nav-mobile">
            <router-link to="/smartlearn/movil" @click="menuOpen = false">
              <SlIcon name="phone" :size="18" />
              <span>Sobre Smart Learn Móvil</span>
            </router-link>
          </li>
          <li class="nav-login">
            <router-link to="/login" @click="menuOpen = false">
              <SlIcon name="login" :size="18" />
              <span>Inicio de sesión</span>
            </router-link>
          </li>
          <li class="nav-register">
            <router-link to="/registro" @click="menuOpen = false">
              <SlIcon name="user" :size="18" />
              <span>Registro de usuario</span>
              <SlIcon name="arrow-right" :size="16" class="btn-arrow" />
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Backdrop interactivo para el menú móvil -->
    <transition name="fade-backdrop">
      <div v-if="menuOpen" class="menu-backdrop" @click="closeMenu" aria-hidden="true"></div>
    </transition>

    <main class="auth-main">
      <router-view></router-view>
    </main>

    <FooterPrincipal />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import FooterPrincipal from './FooterPrincipal.vue';

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

  /* Ocultar tajantemente el botón hamburguesa en desktop (>1100px) */
  @media (min-width: 1101px) {
    .menu-toggle {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  }

  @media (max-width: 1100px) {
    .menu-toggle {
      display: flex !important;
    }
  }

  .header-top {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0;
    text-decoration: none;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .title {
    font-size: 1.55rem;
    font-weight: 850;
    color: var(--sl-ink, #0f172a);
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.1;
  }

  .subtitle {
    font-size: 0.82rem;
    color: var(--sl-muted, #64748b);
    font-weight: 550;
    letter-spacing: -0.01em;
    white-space: nowrap;
    font-style: normal;
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 9998;
  }

  .fade-backdrop-enter-active,
  .fade-backdrop-leave-active {
    transition: opacity 200ms ease;
  }

  .fade-backdrop-enter-from,
  .fade-backdrop-leave-to {
    opacity: 0;
  }
</style>
