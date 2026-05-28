<template>
  <div class="smartLearn-view">

    <section 
      class="topics-carousel-container" 
      aria-label="Navegación de Temas"
      @mouseenter="stopAutoScroll" 
      @mouseleave="startAutoScroll"
    >
      <button @click="handleManualPrev" class="carousel-btn prev-btn" aria-label="Anterior">&#10094;</button>
      
      <div class="topics-carousel" ref="carousel">
        <a href="#que-es" class="topic-card">
          <img src="/images/Fondo_Azul_Smart_Learn_logo copy.png" alt="¿Qué es?" class="carousel-img">
          <h3>¿Qué?</h3>
        </a>
        <a href="#mision" class="topic-card">
          <img src="/images/mision_vector.png" alt="Misión" class="carousel-img">
          <h3>Misión</h3>
        </a>
        <a href="#ofrece" class="topic-card">
          <img src="/images/educacion_vector.png" alt="¿Qué ofrece?" class="carousel-img">
          <h3>¿Qué ofrece?</h3>
        </a>
        <a href="#porque-existe" class="topic-card">
          <img src="/images/pregunta_vector.png" alt="¿Por qué?" class="carousel-img">
          <h3>¿Por qué?</h3>
        </a>
        <a href="#accesibilidad" class="topic-card">
          <img src="/images/accesibilidad_vector.png" alt="Accesibilidad" class="carousel-img">
          <h3>Accesibilidad</h3>
        </a>
      </div>
      
      <button @click="handleManualNext" class="carousel-btn next-btn" aria-label="Siguiente">&#10095;</button>
    </section>

    <section class="hero" aria-labelledby="hero-title">
      <h2 id="hero-title">Aprende sin límites</h2>
      <p style="color: #324378;">Una plataforma educativa 100% accesible diseñada para personas con discapacidad visual.</p>
    </section>
    <section aria-labelledby="que-es">
      <h2 id="que-es">¿Qué es Smart Learn?</h2>
      <div class="card info-block">
        <div class="info-text">
          <p>Smart Learn es una plataforma educativa accesible creada por <strong>CyberPath S.A.S</strong> Diseñada especialmente para estudiantes con discapacidad visual, ofrece herramientas que permiten un aprendizaje autónomo, intuitivo y seguro.</p>
        </div>
        <img src="/images/Fondo_Azul_Smart_Learn_logo.png" alt="Logo">
      </div>
    </section>

    <section aria-labelledby="mision">
      <h2 id="mision">Nuestra misión</h2>
      <div class="card info-block">
        <img src="/images/misionEducativa.jpg" alt="Misión">
        <div class="info-text">
          <p>Brindar acceso a educación de calidad a todas las personas mediante tecnología inclusiva que derribe las barreras que enfrentan las personas con discapacidad visual en su proceso de aprendizaje.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="ofrece">
      <h2 id="ofrece">¿Qué ofrece Smart Learn?</h2>
      <div class="card info-block">
        <div class="info-text">
          <p><i>Smart Learn ofrece:</i> </p>
          <p><li>Lectura en voz alta y navegación mediante audio.</li></p>
          <p><li>Reconocimiento y control por voz.</li></p>
          <p><li>Contenido totalmente accesible.</li></p>
          <p><li>Compatibilidad con dispositivos Braille.</li></p>
          <p><li>Seguimiento académico personalizado.</li></p>
        </div>
        <img src="/images/tecnologiaInclusiva.jpeg" alt="Tecnología">
      </div>
    </section>

    <section aria-labelledby="porque-existe">
      <h2 id="porque-existe">¿Por qué existe Smart Learn?</h2>
      <div class="card info-block">
        <img src="/images/accesibilidadEducativa.png" alt="Accesibilidad">
        <div class="info-text">
          <p>En México, miles de estudiantes con discapacidad visual enfrentan dificultades para acceder a materiales educativos adecuados. Smart Learn surge como una solución basada en investigaciones del INEGI y otras fuentes confiables que evidencian la necesidad urgente de herramientas verdaderamente accesibles.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="accesibilidad">
      <h2 id="accesibilidad">Accesibilidad ante todo</h2>
      <div class="card info-block">
        <div class="info-text">
          <p>La plataforma está diseñada siguiendo estándares de accesibilidad digital, permitiendo que cualquier usuario, con o sin discapacidad visual, pueda navegarla con facilidad, ya sea mediante audio, teclado, dispositivos asistivos o controles tradicionales.</p>
        </div>
        <img src="/images/accesibilidadDigital.jpg" alt="Digital">
      </div>
    </section>

  </div>
</template>

<script setup>
import NavBarPrincipal from '../components/NavBarPrincipal.vue';
import { useRouter } from 'vue-router';
const router = useRouter(); 

import { ref, onMounted, onUnmounted } from 'vue';

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
        el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        el.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
};

const scrollPrev = () => {
    const el = carousel.value;
    if (!el) return;

    if (el.scrollLeft <= 0) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
        el.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
};

const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(scrollNext, 3000);
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