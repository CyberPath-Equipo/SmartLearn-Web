<template>
  <svg 
    class="sl-icon" 
    :class="iconClass"
    :viewBox="viewBox || '0 0 24 24'" 
    :width="size || 20" 
    :height="size || 20" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- 01 · Sparkles / Destellos -->
    <template v-if="name === 'sparkles'">
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/>
      <path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/>
    </template>

    <!-- 02 · Target / Propósito -->
    <template v-else-if="name === 'target'">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </template>

    <!-- 03 · Book / Libro -->
    <template v-else-if="name === 'book'">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
      <path d="M6 6h10M6 10h10"/>
    </template>

    <!-- 04 · Info / Información -->
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 11v5.5"/>
      <circle cx="12" cy="7.5" r=".75" fill="currentColor"/>
    </template>

    <!-- 05 · Accessibility / Inclusión -->
    <template v-else-if="name === 'accessibility'">
      <circle cx="12" cy="4.5" r="2"/>
      <path d="m4 8.5 8 1.5 8-1.5"/>
      <path d="M12 10v4.5m0 0-4.2 6.5M12 14.5l4.2 6.5"/>
    </template>

    <!-- Volume / Audio -->
    <template v-else-if="name === 'volume'">
      <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </template>

    <!-- Braille / Dispositivos Asistivos -->
    <template v-else-if="name === 'braille'">
      <circle cx="7" cy="6" r="1.75" fill="currentColor"/>
      <circle cx="7" cy="12" r="1.75" fill="currentColor"/>
      <circle cx="7" cy="18" r="1.75"/>
      <circle cx="17" cy="6" r="1.75" fill="currentColor"/>
      <circle cx="17" cy="12" r="1.75"/>
      <circle cx="17" cy="18" r="1.75" fill="currentColor"/>
    </template>

    <!-- Phone / Teléfono Móvil -->
    <template v-else-if="name === 'phone'">
      <rect x="6" y="2" width="12" height="20" rx="3"/>
      <path d="M10 5h4M11 19h2"/>
    </template>

    <!-- Login / Iniciar Sesión -->
    <template v-else-if="name === 'login'">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <path d="M10 17l5-5-5-5M15 12H3"/>
    </template>

    <!-- User / Usuario -->
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    </template>

    <!-- Arrow Right -->
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5"/>
    </template>

    <!-- Arrow Left -->
    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5m5.5-5.5L5 12l5.5 5.5"/>
    </template>

    <!-- Chevron Left -->
    <template v-else-if="name === 'chevron-left'">
      <path d="m15 5-7 7 7 7"/>
    </template>

    <!-- Chevron Right -->
    <template v-else-if="name === 'chevron-right'">
      <path d="m9 5 7 7-7 7"/>
    </template>

    <!-- Play -->
    <template v-else-if="name === 'play'">
      <polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/>
    </template>

    <!-- Mic -->
    <template v-else-if="name === 'mic'">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/>
    </template>

    <!-- Moon -->
    <template v-else-if="name === 'moon'">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
    </template>

    <!-- Shield Check -->
    <template v-else-if="name === 'shield-check'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
      <path d="m9 12 2 2 4-4"/>
    </template>

    <!-- Layers -->
    <template v-else-if="name === 'layers'">
      <path d="m12 3 9.5 4.8L12 12.5 2.5 7.8 12 3Z"/>
      <path d="m3 12.2 9 4.6 9-4.6"/>
      <path d="m3 16.4 9 4.6 9-4.6"/>
    </template>

    <!-- Chart -->
    <template v-else-if="name === 'chart'">
      <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
      <path d="M8 16v-5M13 16V7M18 16v-8"/>
    </template>

    <!-- Check Circle -->
    <template v-else-if="name === 'check-circle'">
      <circle cx="12" cy="12" r="9"/>
      <path d="m8.5 12.5 2.3 2.3 4.7-4.8"/>
    </template>

    <!-- Zoom In -->
    <template v-else-if="name === 'zoom-in'">
      <circle cx="11" cy="11" r="7"/>
      <path d="m20 20-3.8-3.8M11 8v6M8 11h6"/>
    </template>

    <!-- Close -->
    <template v-else-if="name === 'close'">
      <path d="M18 6 6 18M6 6l12 12"/>
    </template>

    <!-- Mail -->
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="m3 7 9 6 9-6"/>
    </template>

    <!-- Instagram -->
    <template v-else-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </template>

    <!-- YouTube -->
    <template v-else-if="name === 'youtube'">
      <rect x="2" y="5" width="20" height="14" rx="4"/>
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none"/>
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 20
  },
  viewBox: {
    type: String,
    default: '0 0 24 24'
  },
  iconClass: {
    type: String,
    default: ''
  }
});
</script>
