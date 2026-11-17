<template>
  <div class="smartLearn-view">

    <!-- HERO PRINCIPAL -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="hero-pill-badge">
          <SlIcon name="accessibility" :size="16" />
          <span>Educación Inclusiva · Estándar WCAG 2.2</span>
        </div>
        <h2 id="hero-title">Aprende sin límites</h2>
        <p>Una plataforma educativa 100% accesible diseñada para personas con discapacidad visual y auditiva, integrando lectura por voz, navegación asistida y seguimiento docente.</p>
        <div class="hero-cta-group">
          <router-link to="/login" class="btn-emil-primary">
            <span>Iniciar sesión</span>
            <SlIcon name="arrow-right" :size="16" class="btn-arrow" />
          </router-link>
          <router-link to="/smartlearn/movil" class="btn-emil-secondary">
            <SlIcon name="phone" :size="18" />
            <span>Explorar App Móvil</span>
          </router-link>
        </div>
      </div>

      <div class="hero-media" aria-hidden="true">
        <div class="hero-photo-frame">
          <img src="/images/misionEducativa.jpg" alt="" />
        </div>
        <div class="hero-badges-cluster">
          <div class="hero-floating-badge badge-top-right">
            <span class="badge-icon-box">
              <SlIcon name="volume" :size="20" />
            </span>
            <div>
              <strong>Audio y Voz Activos</strong>
              <span>Navegación 100% guiada</span>
            </div>
          </div>
          <div class="hero-floating-badge badge-bottom-left">
            <span class="badge-icon-box badge-icon-cyan">
              <SlIcon name="braille" :size="20" />
            </span>
            <div>
              <strong>Soporte Braille y Teclado</strong>
              <span>Tecnología asistiva integrada</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NAVEGADOR DE TEMAS / CARRUSEL -->
    <section 
      class="topics-carousel-container" 
      aria-label="Navegación de Temas"
      @mouseenter="stopAutoScroll" 
      @mouseleave="startAutoScroll"
    >
      <button @click="handleManualPrev" class="carousel-btn prev-btn desktop-only" aria-label="Anterior">
        <SlIcon name="chevron-left" :size="20" />
      </button>
      
      <div class="topics-carousel" ref="carousel">
        <router-link to="/smartlearn#que-es" class="topic-card">
          <span class="topic-icon-badge">
            <SlIcon name="sparkles" :size="22" class="topic-icon" />
          </span>
          <div class="topic-card-text">
            <span class="topic-step">01 · Plataforma</span>
            <h3>¿Qué es?</h3>
          </div>
        </router-link>
        <router-link to="/smartlearn#mision" class="topic-card">
          <span class="topic-icon-badge">
            <SlIcon name="target" :size="22" class="topic-icon" />
          </span>
          <div class="topic-card-text">
            <span class="topic-step">02 · Propósito</span>
            <h3>Misión</h3>
          </div>
        </router-link>
        <router-link to="/smartlearn#ofrece" class="topic-card">
          <span class="topic-icon-badge">
            <SlIcon name="book" :size="22" class="topic-icon" />
          </span>
          <div class="topic-card-text">
            <span class="topic-step">03 · Herramientas</span>
            <h3>¿Qué ofrece?</h3>
          </div>
        </router-link>
        <router-link to="/smartlearn#porque-existe" class="topic-card">
          <span class="topic-icon-badge">
            <SlIcon name="info" :size="22" class="topic-icon" />
          </span>
          <div class="topic-card-text">
            <span class="topic-step">04 · Impacto</span>
            <h3>¿Por qué?</h3>
          </div>
        </router-link>
        <router-link to="/smartlearn#accesibilidad" class="topic-card">
          <span class="topic-icon-badge">
            <SlIcon name="accessibility" :size="22" class="topic-icon" />
          </span>
          <div class="topic-card-text">
            <span class="topic-step">05 · Inclusión</span>
            <h3>Accesibilidad</h3>
          </div>
        </router-link>
      </div>
      
      <button @click="handleManualNext" class="carousel-btn next-btn desktop-only" aria-label="Siguiente">
        <SlIcon name="chevron-right" :size="20" />
      </button>

      <!-- Controles móviles en flujo natural (NUNCA solapan las tarjetas) -->
      <div class="carousel-mobile-nav">
        <button @click="handleManualPrev" class="carousel-nav-btn" aria-label="Tema anterior">
          <SlIcon name="chevron-left" :size="18" />
        </button>
        <div class="carousel-nav-indicator">
          <span>Desliza para explorar</span>
        </div>
        <button @click="handleManualNext" class="carousel-nav-btn" aria-label="Tema siguiente">
          <SlIcon name="chevron-right" :size="18" />
        </button>
      </div>
    </section>

    <!-- SECCIÓN 1: ¿QUÉ ES SMART LEARN? -->
    <section id="que-es" aria-labelledby="que-es-title" class="story-section">
      <div class="card info-block">
        <div class="info-text">
          <span class="story-pill">Identidad del Proyecto</span>
          <h2 id="que-es-title">¿Qué es Smart Learn?</h2>
          <p>Smart Learn es una plataforma educativa accesible creada por <strong>CyberPath S.A.S.</strong> Diseñada especialmente para estudiantes con discapacidad visual, ofrece herramientas que permiten un aprendizaje autónomo, intuitivo y seguro.</p>
          <div class="story-tags-row">
            <span class="story-tag"><SlIcon name="shield-check" :size="16" /> Aprendizaje Autónomo</span>
            <span class="story-tag"><SlIcon name="layers" :size="16" /> Web + App Móvil</span>
          </div>
        </div>
        <div class="story-visual-frame story-visual-brand">
          <img src="/images/Blanco_sin_fondo_Recortada_Smart_Learn_logo.png" alt="Logo de Smart Learn">
        </div>
      </div>
    </section>

    <!-- SECCIÓN 2: NUESTRA MISIÓN -->
    <section id="mision" aria-labelledby="mision-title" class="story-section">
      <div class="card info-block info-block-reverse">
        <div class="story-visual-frame">
          <img src="/images/misionEducativa.jpg" alt="Estudiantes colaborando con herramientas tecnológicas inclusivas">
        </div>
        <div class="info-text">
          <span class="story-pill">Compromiso Educativo</span>
          <h2 id="mision-title">Nuestra misión</h2>
          <p>Brindar acceso a educación de calidad a todas las personas mediante tecnología inclusiva que derribe las barreras que enfrentan las personas con discapacidad visual en su proceso de aprendizaje.</p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 3: ¿QUÉ OFRECE SMART LEARN? -->
    <section id="ofrece" aria-labelledby="ofrece-title" class="story-section">
      <div class="card info-block">
        <div class="info-text">
          <span class="story-pill">Capacidades de la Plataforma</span>
          <h2 id="ofrece-title">¿Qué ofrece Smart Learn?</h2>
          <p class="story-lead"><i>Un ecosistema integral de herramientas asistivas y académicas:</i></p>
          <ul class="feature-check-list">
            <li>
              <span class="feature-bullet"><SlIcon name="volume" :size="16" /></span>
              <span>Lectura en voz alta y navegación mediante audio.</span>
            </li>
            <li>
              <span class="feature-bullet"><SlIcon name="mic" :size="16" /></span>
              <span>Reconocimiento y control por voz.</span>
            </li>
            <li>
              <span class="feature-bullet"><SlIcon name="check-circle" :size="16" /></span>
              <span>Contenido totalmente accesible y estructurado.</span>
            </li>
            <li>
              <span class="feature-bullet"><SlIcon name="braille" :size="16" /></span>
              <span>Compatibilidad con dispositivos Braille.</span>
            </li>
            <li>
              <span class="feature-bullet"><SlIcon name="chart" :size="16" /></span>
              <span>Seguimiento académico personalizado en tiempo real.</span>
            </li>
          </ul>
        </div>
        <ProductGallery />
      </div>
    </section>

    <!-- SECCIÓN 4: ¿POR QUÉ EXISTE SMART LEARN? -->
    <section id="porque-existe" aria-labelledby="porque-existe-title" class="story-section">
      <div class="card info-block info-block-reverse">
        <div class="story-visual-frame">
          <img src="/images/accesibilidadEducativa.png" alt="Estudiantes en aula utilizando tabletas educativas accesibles">
        </div>
        <div class="info-text">
          <span class="story-pill">Contexto en México</span>
          <h2 id="porque-existe-title">¿Por qué existe Smart Learn?</h2>
          <p>En México, miles de estudiantes con discapacidad visual enfrentan dificultades para acceder a materiales educativos adecuados. Smart Learn surge como una solución basada en investigaciones del INEGI y otras fuentes confiables que evidencian la necesidad urgente de herramientas verdaderamente accesibles.</p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 5: ACCESIBILIDAD ANTE TODO -->
    <section id="accesibilidad" aria-labelledby="accesibilidad-title" class="story-section">
      <div class="card info-block">
        <div class="info-text">
          <span class="story-pill">Arquitectura WCAG 2.2</span>
          <h2 id="accesibilidad-title">Accesibilidad ante todo</h2>
          <p>La plataforma está diseñada siguiendo estándares internacionales de accesibilidad digital, permitiendo que cualquier usuario, con o sin discapacidad visual, pueda navegarla con facilidad, ya sea mediante audio, teclado, dispositivos asistivos o controles tradicionales.</p>
          <div class="story-tags-row">
            <span class="story-tag"><SlIcon name="volume" :size="16" /> Lectores de Pantalla</span>
            <span class="story-tag"><SlIcon name="braille" :size="16" /> Salida Braille</span>
            <span class="story-tag"><SlIcon name="accessibility" :size="16" /> Navegación por Teclado</span>
          </div>
        </div>
        <div class="story-visual-frame story-visual-diagram">
          <img src="/images/smartlearn-wcag-architecture.svg" alt="Diagrama de arquitectura de accesibilidad digital: TalkBack/NVDA, foco por teclado, alto contraste AAA y diseño adaptativo">
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ProductGallery from '../components/ProductGallery.vue';

const carousel = ref(null);
let autoScrollInterval = null;

const getScrollAmount = () => {
    if (!carousel.value) return 200;
    const card = carousel.value.querySelector('.topic-card');
    return card ? card.offsetWidth + 20 : 200;
};

const scrollNext = () => {
    const el = carousel.value;
    if (!el) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
        el.scrollBy({ left: getScrollAmount(), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
};

const scrollPrev = () => {
    const el = carousel.value;
    if (!el) return;

    if (el.scrollLeft <= 0) {
        el.scrollTo({ left: el.scrollWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
        el.scrollBy({ left: -getScrollAmount(), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
};

const startAutoScroll = () => {
    stopAutoScroll();
    // Navigation remains still until the user chooses a direction.
};

const stopAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
};

const handleManualNext = () => {
    scrollNext();
    startAutoScroll();
};

const handleManualPrev = () => {
    scrollPrev();
    startAutoScroll();
};

onMounted(() => {
    startAutoScroll();
});
onUnmounted(() => {
    stopAutoScroll();
});
</script>
