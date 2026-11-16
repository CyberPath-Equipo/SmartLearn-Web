<template>
  <div class="smartLearn-movil-view">

    <!-- HERO / BIENVENIDA -->
    <section class="hero-movil" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-pill-badge">
          <SlIcon name="phone" :size="16" />
          <span>Aplicación Android · Accesibilidad Nativa</span>
        </div>
        <h2 id="hero-title">Smart Learn en tu Bolsillo</h2>
        <p>Lleva tu educación accesible a cualquier lugar. Diseñada específicamente para ser intuitiva, rápida y 100% compatible con tecnologías de asistencia en dispositivos móviles.</p>
        <div class="hero-actions-row">
          <a href="#video-demo" class="hero-btn-movil btn-emil-primary">
            <SlIcon name="play" :size="16" />
            <span>Ver demostración</span>
          </a>
          <a href="#gallery-section" class="btn-emil-secondary">
            <span>Explorar pantallas</span>
            <SlIcon name="arrow-right" :size="16" class="btn-arrow" />
          </a>
        </div>
      </div>

      <div class="mobile-hero-stage" aria-hidden="true">
        <div class="hero-ambient-glow"></div>
        <!-- Realistic Hero Phone Hardware -->
        <div class="phone-device phone-device--hero">
          <span class="phone-hw-btn phone-hw-silent"></span>
          <span class="phone-hw-btn phone-hw-vol-up"></span>
          <span class="phone-hw-btn phone-hw-vol-down"></span>
          <span class="phone-hw-btn phone-hw-power"></span>
          <div class="phone-bezel">
            <div class="phone-island-pill">
              <span class="island-camera"></span>
            </div>
            <div class="phone-viewport">
              <img src="/images/movil_main-screnn.png" alt="Smart Learn Móvil Inicio" />
              <div class="phone-glass-glare"></div>
            </div>
            <div class="phone-chin">
              <span class="phone-home-bar"></span>
            </div>
          </div>
        </div>

        <!-- Floating Feature Chips -->
        <div class="hero-floating-chip chip-tts">
          <span class="chip-icon"><SlIcon name="volume" :size="18" /></span>
          <div>
            <strong>Lectura por Voz (TTS)</strong>
            <span>Navegación auditiva guiada</span>
          </div>
        </div>
        <div class="hero-floating-chip chip-contrast">
          <span class="chip-icon"><SlIcon name="accessibility" :size="18" /></span>
          <div>
            <strong>Diseño WCAG 2.1 AA</strong>
            <span>Áreas táctiles ampliadas</span>
          </div>
        </div>
      </div>
    </section>

    <!-- INTRODUCCIÓN Y BENEFICIOS -->
    <section aria-labelledby="porque-movil" class="intro-section">
      <div class="section-heading-block">
        <h2 id="porque-movil">¿Por qué usar la App Móvil?</h2>
        <p class="section-desc">La aplicación móvil de <strong>Smart Learn</strong> ha sido optimizada desde cero para responder a las necesidades de accesibilidad portátil con controles por voz nativos, gestos hápticos y alto contraste adaptativo.</p>
      </div>

      <div class="card info-block-movil">
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon-box">
              <SlIcon name="phone" :size="22" />
            </div>
            <div>
              <h3>Portabilidad Total</h3>
              <p>Estudia tus materias, repasa teorías y resuelve evaluaciones en el transporte o fuera de casa con total autonomía.</p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon-box">
              <SlIcon name="accessibility" :size="22" />
            </div>
            <div>
              <h3>Gestos Inteligentes</h3>
              <p>Interfaz simplificada con áreas de toque de mínimo 48px y retroalimentación táctil clara en cada acción.</p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon-box">
              <SlIcon name="volume" :size="22" />
            </div>
            <div>
              <h3>Sintetizador de Voz Nativo</h3>
              <p>Utiliza el motor de texto a voz (TTS) y TalkBack de tu teléfono para una lectura fluida y natural de las teorías.</p>
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon-box">
              <SlIcon name="moon" :size="22" />
            </div>
            <div>
              <h3>Soporte de Contraste Extremo</h3>
              <p>Modo claro y nocturno validados bajo criterios de luminancia para mitigar la fatiga visual en todo entorno.</p>
            </div>
          </div>
        </div>

        <div class="logo-container-movil">
          <div class="emblem-halo">
            <img src="/images/Azul_sin_fondo_Smart_Learn_logo_redondeada.png" alt="Smart Learn Mobile Logo" class="floating-logo">
          </div>
        </div>
      </div>
    </section>

    <!-- VIDEO DEMOSTRATIVO -->
    <section id="video-demo" aria-labelledby="video-title" class="video-section">
      <div class="section-heading-block">
        <h2 id="video-title">Funcionamiento en Acción</h2>
        <p class="section-desc">Mira el siguiente video interactivo para conocer cómo se navega, cómo se escuchan los temas y cómo se responde a los ejercicios desde la app móvil.</p>
      </div>
      
      <div class="video-card">
        <div class="video-frame-bar" aria-hidden="true">
          <span class="frame-dot"></span>
          <span class="frame-dot"></span>
          <span class="frame-dot"></span>
          <span class="frame-title">Smart Learn Android · Demostración de Accesibilidad</span>
        </div>
        <div class="video-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/5O6qsRPnr-0" 
            title="Smart Learn Móvil - Demostración de Funcionamiento"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- GALERÍA DE PANTALLAS (MOCKUPS 100% COMPLETAS Y SIN RECORTE) -->
    <section id="gallery-section" aria-labelledby="gallery-title" class="gallery-section">
      <div class="gallery-header-row">
        <div>
          <h2 id="gallery-title">Explora la Interfaz Móvil</h2>
          <p class="section-desc">Nuestra interfaz móvil está diseñada para cumplir con las pautas de accesibilidad para el contenido web (WCAG 2.1), asegurando legibilidad, orden lógico de foco y facilidad de uso.</p>
        </div>
      </div>

      <div class="mockups-grid">
        <article 
          v-for="(screen, idx) in screens" 
          :key="screen.id" 
          class="mockup-card"
          @click="openScreenModal(idx)"
        >
          <div class="mockup-card-top">
            <span class="mockup-step-num">0{{ idx + 1 }}</span>
            <span class="mockup-tag">{{ screen.tag }}</span>
          </div>

          <!-- Phone Hardware Mockup Proporcionado -->
          <div class="phone-mockup" :class="{ 'phone-mockup--dark': screen.darkStatus }">
            <span class="phone-hw-btn phone-hw-silent" aria-hidden="true"></span>
            <span class="phone-hw-btn phone-hw-vol-up" aria-hidden="true"></span>
            <span class="phone-hw-btn phone-hw-vol-down" aria-hidden="true"></span>
            <span class="phone-hw-btn phone-hw-power" aria-hidden="true"></span>

            <div class="phone-bezel">
              <div class="phone-island-pill" aria-hidden="true">
                <span class="island-camera"></span>
              </div>

              <!-- Viewport Completo de la Pantalla Real -->
              <div class="phone-screen">
                <img :src="screen.img" :alt="screen.alt" loading="lazy" />
                <div class="phone-glass-glare" aria-hidden="true"></div>
              </div>

              <div class="phone-chin" aria-hidden="true">
                <span class="phone-home-bar"></span>
              </div>
            </div>
          </div>

          <div class="mockup-desc">
            <h3>{{ screen.title }}</h3>
            <p>{{ screen.desc }}</p>
            <button type="button" class="btn-mockup-inspect" @click.stop="openScreenModal(idx)">
              <SlIcon name="zoom-in" :size="16" />
              <span>Ver en detalle</span>
              <SlIcon name="arrow-right" :size="14" class="btn-arrow" />
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- MODAL INTERACTIVO DE VISTA DETALLADA DE MOCKUP -->
    <div 
      v-if="selectedScreenIndex !== null" 
      class="modal-overlay mockup-lightbox-overlay" 
      role="dialog" 
      aria-modal="true"
      :aria-label="currentScreen.title"
      @click.self="closeScreenModal"
    >
      <div class="modal-card mockup-lightbox-card">
        <div class="mockup-lightbox-header">
          <div class="mockup-lightbox-meta">
            <span class="mockup-step-num">Pantalla 0{{ selectedScreenIndex + 1 }} de 06</span>
            <span class="mockup-tag">{{ currentScreen.tag }}</span>
          </div>
          <button type="button" class="btn-close" aria-label="Cerrar vista detallada" @click="closeScreenModal">
            <SlIcon name="close" :size="18" />
          </button>
        </div>

        <div class="mockup-lightbox-body" :class="{ 'is-switching': isSwitchingScreen }">
          <div class="phone-mockup phone-mockup--large" :class="{ 'phone-mockup--dark': currentScreen.darkStatus }">
            <div class="phone-bezel">
              <div class="phone-island-pill" aria-hidden="true">
                <span class="island-camera"></span>
              </div>
              <div class="phone-screen">
                <img :src="currentScreen.img" :alt="currentScreen.alt" />
                <div class="phone-glass-glare" aria-hidden="true"></div>
              </div>
              <div class="phone-chin" aria-hidden="true">
                <span class="phone-home-bar"></span>
              </div>
            </div>
          </div>

          <div class="mockup-lightbox-info">
            <h3>{{ currentScreen.title }}</h3>
            <p>{{ currentScreen.desc }}</p>
            <ul class="lightbox-feature-list">
              <li v-for="(point, pIdx) in currentScreen.highlights" :key="pIdx">
                <SlIcon name="check-circle" :size="16" />
                <span>{{ point }}</span>
              </li>
            </ul>

            <div class="lightbox-nav-controls">
              <button type="button" class="btn-secondary" @click="stepScreen(-1)">
                <SlIcon name="chevron-left" :size="16" />
                <span>Anterior</span>
              </button>
              <button type="button" class="btn-primary-blue" @click="stepScreen(1)">
                <span>Siguiente pantalla</span>
                <SlIcon name="chevron-right" :size="16" class="btn-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROXIMAMENTE / CTA CON ICONOS PROPORCIONADOS POR EL USUARIO -->
    <section class="cta-movil" aria-labelledby="cta-title">
      <div class="cta-content">
        <span class="cta-eyebrow-pill">Lanzamiento Multiplataforma</span>
        <h2 id="cta-title">Próximamente disponible</h2>
        <p>Estamos trabajando activamente para publicar Smart Learn en las tiendas oficiales de aplicaciones. ¡Pronto podrás descargarla gratis en Android e iOS!</p>
        
        <div class="store-buttons">
          <!-- Google Play Badge Oficial con playstore.png -->
          <div class="store-badge google-play-badge" tabindex="0" role="button" aria-label="Próximamente disponible en Google Play Store">
            <img src="/images/playstore.png" alt="Google Play Logo" class="store-badge-icon-img" />
            <div class="store-text">
              <span class="store-sub">DISPONIBLE PRONTO EN</span>
              <strong class="store-name">Google Play</strong>
            </div>
          </div>

          <!-- Apple App Store Badge Oficial con appstore.png -->
          <div class="store-badge apple-store-badge" tabindex="0" role="button" aria-label="Próximamente disponible en Apple App Store">
            <img src="/images/appstore.png" alt="Apple App Store Logo" class="store-badge-icon-img" />
            <div class="store-text">
              <span class="store-sub">PRÓXIMAMENTE EN</span>
              <strong class="store-name">App Store</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 6 Pantallas oficiales verificadas de la app móvil
const screens = [
  {
    id: 'inicio',
    title: '1. Inicio / Mis Materias',
    tag: 'Navegación por Voz',
    img: '/images/movil_main-screnn.png',
    alt: 'Pantalla de Inicio de la App Móvil con asignaturas inscritas',
    darkStatus: false,
    desc: 'Acceso directo a tus materias inscritas con tarjetas de alto contraste, botones táctiles ampliados y descripciones auditivas optimizadas.',
    highlights: [
      'Tarjetas de asignatura con alto contraste y tipografía legible.',
      'Controles inferiores accesibles para navegación con una sola mano.',
      'Compatibilidad completa con lectores de pantalla TalkBack y VoiceOver.'
    ]
  },
  {
    id: 'inscribir',
    title: '2. Inscribir Materias',
    tag: 'Búsqueda Accesible',
    img: '/images/movil_inscribir-materia.png',
    alt: 'Pantalla de Inscripción de Materias',
    darkStatus: false,
    desc: 'Buscador accesible para agregar asignaturas de manera rápida, con soporte de dictado y confirmación auditiva en cada acción.',
    highlights: [
      'Campo de búsqueda de gran tamaño con soporte para entrada por voz.',
      'Lista simplificada con botón de inscripción directo.',
      'Foco visual enmarcado de 3px para usuarios con baja visión.'
    ]
  },
  {
    id: 'temas',
    title: '3. Selección de Temas',
    tag: 'Jerarquía Clara',
    img: '/images/movil_tema.png',
    alt: 'Pantalla de Selección de Temas',
    darkStatus: false,
    desc: 'Estructura modular de lecciones y unidades de estudio con indicadores claros de avance y tiempo estimado.',
    highlights: [
      'Encabezados semánticos que facilitan el salto rápido entre unidades.',
      'Indicadores de estado (completado, en curso, pendiente).',
      'Compatibilidad con dispositivos Braille móviles por Bluetooth.'
    ]
  },
  {
    id: 'subtemas',
    title: '4. Subtemas y Módulos',
    tag: 'Foco Visual Guiado',
    img: '/images/movil_subtema.png',
    alt: 'Pantalla de Subtemas y Módulos',
    darkStatus: false,
    desc: 'Desglose detallado de contenidos teóricos y prácticos con orden secuencial intuitivo.',
    highlights: [
      'Orden de lectura lógico verificado bajo pautas WCAG 2.1.',
      'Botones con área táctil mínima de 48dp para evitar toques accidentales.',
      'Retroalimentación háptica en la selección de opciones.'
    ]
  },
  {
    id: 'teoria',
    title: '5. Contenido Teórico y Audio',
    tag: 'Lector TTS Integrado',
    img: '/images/movil_teoria.png',
    alt: 'Pantalla de Contenido Teórico con Reproductor de Voz',
    darkStatus: false,
    desc: 'Lectura en voz alta integrada con controles accesibles de pausa, repetición y velocidad de voz adaptada a cada alumno.',
    highlights: [
      'Barra superior accesible para pausar o acelerar la lectura en voz alta.',
      'Tipografía con interlineado holgado para reducir el estrés ocular.',
      'Resumen auditivo disponible al pulsar dos veces en cualquier sección.'
    ]
  },
  {
    id: 'noche',
    title: '6. Modo Noche y Alto Contraste',
    tag: 'Inclusión Visual AAA',
    img: '/images/movil_modo-noche.png',
    alt: 'Pantalla en Modo Oscuro y Alto Contraste',
    darkStatus: true,
    desc: 'Paleta oscura calibrada con contraste superior a 7:1 (nivel AAA) para estudiantes con fotofobia o fatiga visual.',
    highlights: [
      'Fondo oscuro puro para máximo ahorro de batería y descanso visual.',
      'Textos blancos y cian brillantes con bordes nítidos.',
      'Transición instantánea entre modos sin recargar la sesión.'
    ]
  }
];

const selectedScreenIndex = ref(null);
const isSwitchingScreen = ref(false);

const currentScreen = computed(() => {
  if (selectedScreenIndex.value === null) return screens[0];
  return screens[selectedScreenIndex.value];
});

const openScreenModal = (index) => {
  selectedScreenIndex.value = index;
  document.body.style.overflow = 'hidden';
};

const closeScreenModal = () => {
  selectedScreenIndex.value = null;
  document.body.style.overflow = '';
};

const stepScreen = (direction) => {
  if (selectedScreenIndex.value === null) return;
  isSwitchingScreen.value = true;
  setTimeout(() => {
    const total = screens.length;
    selectedScreenIndex.value = (selectedScreenIndex.value + direction + total) % total;
    isSwitchingScreen.value = false;
  }, 120);
};

// Accesibilidad por teclado en modal (Escape para cerrar, Izq/Der para pasar pantalla)
const handleKeyDown = (e) => {
  if (selectedScreenIndex.value === null) return;
  if (e.key === 'Escape') closeScreenModal();
  if (e.key === 'ArrowRight') stepScreen(1);
  if (e.key === 'ArrowLeft') stepScreen(-1);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Modal Lightbox - Máxima Prioridad y Foco Centrado */
.mockup-lightbox-overlay {
  position: fixed !important;
  inset: 0 !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(8, 17, 30, 0.82) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  padding: 24px !important;
  overflow-y: auto !important;
}

.mockup-lightbox-card {
  position: relative !important;
  z-index: 1000000 !important;
  background: #ffffff !important;
  color: #1e293b !important;
  border-radius: 24px !important;
  box-shadow: 0 32px 72px -16px rgba(0, 0, 0, 0.5) !important;
  max-width: 860px !important;
  width: 100% !important;
  max-height: calc(100vh - 48px) !important;
  overflow-y: auto !important;
  padding: 28px 32px !important;
}

/* Teléfono en Modal sin rotación 3D para lectura clara */
.mockup-lightbox-card .phone-mockup {
  transform: none !important;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.35) !important;
}

/* Iconos Oficiales en Badges de Tienda */
.store-badge-icon-img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: contain;
  flex-shrink: 0;
}
</style>
