<template>
  <div class="product-gallery" role="region" aria-roledescription="carrusel" aria-label="Imágenes de Smart Learn"
    @keydown.left.prevent="move(-1, false)" @keydown.right.prevent="move(1, false)">
    <div ref="track" class="product-gallery-track" @scroll.passive="updatePosition">
      <div v-for="(slide, index) in slides" :key="slide.file" class="product-gallery-slide"
        role="group" aria-roledescription="diapositiva" :aria-label="`${index + 1} de ${slides.length}`">
        <img :src="`/images/${slide.file}`" :alt="slide.alt" width="738" height="1600" loading="lazy" decoding="async">
      </div>
    </div>
    <div class="product-gallery-controls">
      <button type="button" aria-label="Imagen anterior" :disabled="active === 0" @click="move(-1, $event.detail > 0)">
        <SlIcon name="chevron-left" :size="20" />
      </button>
      <div class="product-gallery-dots" aria-label="Seleccionar imagen">
        <button v-for="(slide, index) in slides" :key="slide.file" type="button"
          :aria-label="`Ver imagen ${index + 1}: ${slide.alt}`" :aria-current="active === index ? 'true' : undefined"
          @click="goTo(index, $event.detail > 0)"><span /></button>
      </div>
      <button type="button" aria-label="Imagen siguiente" :disabled="active === slides.length - 1" @click="move(1, $event.detail > 0)">
        <SlIcon name="chevron-right" :size="20" />
      </button>
    </div>
    <span class="gallery-sr-only" role="status">Imagen {{ active + 1 }} de {{ slides.length }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const slides = [
  { file: 'imagen (5).jpeg', alt: 'Inicio y materias inscritas en Smart Learn Móvil' },
  { file: 'imagen (4).jpeg', alt: 'Temas disponibles de Historia de México' },
  { file: 'imagen (3).jpeg', alt: 'Subtemas de grandes civilizaciones antiguas' },
  { file: 'imagen (2).jpeg', alt: 'Ejercicios disponibles de grandes civilizaciones antiguas' },
  { file: 'imagen (1).jpeg', alt: 'Configuración de accesibilidad visual y auditiva' },
];
const track = ref(null);
const active = ref(0);
const updatePosition = () => {
  if (track.value?.clientWidth) active.value = Math.round(track.value.scrollLeft / track.value.clientWidth);
};
const goTo = (index, animate = true) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.value?.scrollTo({ left: index * track.value.clientWidth, behavior: animate && !reduced ? 'smooth' : 'instant' });
};
const move = (direction, animate) => goTo(Math.max(0, Math.min(slides.length - 1, active.value + direction)), animate);
</script>

<style scoped>
.product-gallery { min-width: 0; max-width: 100%; }
.product-gallery-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: var(--sl-line-strong) transparent; border-radius: 16px; background: #0b1522; }
.product-gallery-slide { flex: 0 0 100%; min-width: 0; scroll-snap-align: start; display: grid; place-items: center; padding: 24px; }
#app .product-gallery-slide img { width: auto; height: clamp(340px, 42vw, 490px); max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: none; }
.product-gallery-controls { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 16px; }
#app .product-gallery-controls button { width: 44px; height: 44px; padding: 0; border: 1px solid var(--sl-line); background: var(--card-bg); color: var(--sl-ink); }
.product-gallery-dots { display: flex; }
#app .product-gallery-dots button { width: 30px; border: 0; background: transparent; }
.product-gallery-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--sl-muted); }
.product-gallery-dots [aria-current] span { width: 18px; border-radius: 8px; background: var(--primary); }
.gallery-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 640px) { .product-gallery-slide { padding: 16px; } #app .product-gallery-slide img { height: min(110vw, 460px); } }
</style>
