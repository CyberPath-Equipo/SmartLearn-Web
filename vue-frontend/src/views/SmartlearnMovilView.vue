<template>
  <div class="smartLearn-movil-view">

    <!-- HERO / BIENVENIDA -->
    <section class="hero-movil" aria-labelledby="hero-title">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h2 id="hero-title">Smart Learn en tu Bolsillo</h2>
        <p>Lleva tu educación accesible a cualquier lugar. Diseñada específicamente para ser intuitiva, rápida y 100% compatible con tecnologías de asistencia en dispositivos móviles.</p>
        <a href="#video-demo" class="hero-btn-movil">Ver demostración</a>
      </div>
    </section>

    <!-- INTRODUCCIÓN Y BENEFICIOS -->
    <section aria-labelledby="porque-movil" class="intro-section">
      <h2 id="porque-movil">¿Por qué usar la App Móvil?</h2>
      <div class="card info-block-movil">
        <div class="info-text">
          <p>La aplicación móvil de <strong>Smart Learn</strong> ha sido optimizada desde cero para responder a las necesidades de accesibilidad portátil. Al integrar controles por voz nativos, gestos hápticos y alto contraste adaptativo, permite que los estudiantes continúen su aprendizaje de forma autónoma en cualquier momento y lugar.</p>
          <ul class="benefits-list">
            <li><strong>Portabilidad Total:</strong> Estudia tus materias y temas en el transporte o fuera de casa.</li>
            <li><strong>Gestos Inteligentes:</strong> Interfaz simplificada con áreas de toque ampliadas.</li>
            <li><strong>Sintetizador de Voz Nativo:</strong> Utiliza el motor de texto a voz de tu teléfono para una lectura fluida de las teorías.</li>
            <li><strong>Soporte de Contraste Extremo:</strong> Diseños validados para mitigar la fatiga visual.</li>
          </ul>
        </div>
        <div class="logo-container-movil">
          <img src="/images/Azul_sin_fondo_Smart_Learn_logo_redondeada.png" alt="Smart Learn Mobile Logo" class="floating-logo">
        </div>
      </div>
    </section>

    <!-- VIDEO DEMOSTRATIVO -->
    <section id="video-demo" aria-labelledby="video-title" class="video-section">
      <h2 id="video-title">Funcionamiento en Acción</h2>
      <p class="section-desc">Mira el siguiente video interactivo para conocer cómo se navega, cómo se escuchan los temas y cómo se responde a los ejercicios desde la app móvil.</p>
      
      <div class="video-card">
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

    <!-- GALERÍA DE PANTALLAS (MOCKUPS) -->
    <section aria-labelledby="gallery-title" class="gallery-section">
      <h2 id="gallery-title">Explora la Interfaz Móvil</h2>
      <p class="section-desc">Nuestra interfaz móvil está diseñada para cumplir con las pautas de accesibilidad para el contenido web (WCAG 2.1), asegurando legibilidad y facilidad de uso.</p>

      <div class="mockups-grid">
        <!-- PANTALLA 1 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_main-screnn.png" alt="Pantalla de Inicio de la App Móvil">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>1. Inicio / Dashboard</h3>
            <p>Acceso directo a tus materias inscritas con botones de gran tamaño y descripciones auditivas optimizadas.</p>
          </div>
        </div>

        <!-- PANTALLA 2 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_inscribir-materia.png" alt="Pantalla de Inscripción de Materias">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>2. Inscribir Materias</h3>
            <p>Buscador accesible para agregar asignaturas de manera rápida, con soporte de feedback táctil.</p>
          </div>
        </div>

        <!-- PANTALLA 3 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_tema.png" alt="Pantalla de Exploración de Temas">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>3. Estructura de Temas</h3>
            <p>Visualización jerárquica limpia que facilita la ubicación de los contenidos pedagógicos sin distracciones.</p>
          </div>
        </div>

        <!-- PANTALLA 4 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_subtema.png" alt="Pantalla de Exploración de Subtemas">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>4. Lista de Subtemas</h3>
            <p>Acceso rápido a las lecciones individuales de cada tema, permitiendo avanzar a tu propio ritmo.</p>
          </div>
        </div>

        <!-- PANTALLA 5 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_teoria.png" alt="Pantalla de Teoría Accesible">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>5. Lección y Teoría</h3>
            <p>Contenido pedagógico ordenado, listo para ser leído en voz alta por el lector de pantalla nativo.</p>
          </div>
        </div>

        <!-- PANTALLA 6 -->
        <div class="mockup-card">
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <img src="/images/movil_modo-noche.png" alt="Pantalla con el Modo Noche Activo">
            </div>
            <div class="phone-home-btn"></div>
          </div>
          <div class="mockup-desc">
            <h3>6. Modo Noche y Contraste</h3>
            <p>Paleta oscura de alto contraste para mejorar la legibilidad y proteger la vista en entornos de poca luz.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROXIMAMENTE / CTA -->
    <section class="cta-movil" aria-labelledby="cta-title">
      <div class="cta-content">
        <h2 id="cta-title">Próximamente disponible</h2>
        <p>Estamos trabajando activamente para publicar Smart Learn en las tiendas oficiales de aplicaciones. ¡Pronto podrás descargarla gratis en Android e iOS!</p>
        <div class="store-buttons">
          <div class="store-badge google-play">
            <span>Disponible en</span>
            <strong>Google Play</strong>
          </div>
          <div class="store-badge app-store">
            <span>Consíguelo en el</span>
            <strong>App Store</strong>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
// No se requiere lógica compleja para esta vista de presentación
</script>

<style scoped>
/* Contenedor Principal */
.smartLearn-movil-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Hero Móvil Moderno */
.hero-movil {
  position: relative;
  width: 100%;
  padding: 100px 32px;
  margin-top: 20px;
  margin-bottom: 50px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(37, 76, 168, 0.95), rgba(7, 172, 218, 0.85)),
              url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000') center/cover no-repeat;
  color: white;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-movil h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-movil p {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 30px;
  opacity: 0.95;
  color: #f0f7ff;
}

.hero-btn-movil {
  display: inline-block;
  padding: 14px 32px;
  background: white;
  color: var(--secondary);
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.05rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.hero-btn-movil:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: #f7faff;
  color: var(--accent);
}

/* Secciones Generales */
section {
  background: white;
  margin-bottom: 50px;
  padding: 40px;
  border-radius: var(--radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

section:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

section h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: var(--secondary);
  border-left: 6px solid var(--primary);
  padding-left: 15px;
  font-weight: 700;
}

.section-desc {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 32px;
  max-width: 800px;
}

/* Bloques de Información */
.info-block-movil {
  display: flex;
  align-items: center;
  gap: 50px;
  border: none;
  padding: 0;
  box-shadow: none;
}

.benefits-list {
  list-style: none;
  margin: 20px 0 0 0;
  padding: 0;
}

.benefits-list li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 12px;
  font-size: 1.05rem;
  color: #334155;
  line-height: 1.6;
}

.benefits-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-container-movil {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-logo {
  max-width: 260px;
  height: auto;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* Video de Funcionamiento */
.video-card {
  max-width: 800px;
  margin: 0 auto;
  background: #f8fafc;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid #e2e8f0;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* Relación de aspecto 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #000;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Galería de Mockups de Teléfono */
.mockups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 20px;
}

.mockup-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #f8fafc;
  padding: 24px;
  border-radius: var(--radius);
  border: 1px solid #edf2f7;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mockup-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Phone Mockup Realista con CSS */
.phone-mockup {
  position: relative;
  width: 230px;
  height: 470px;
  background: #0f172a;
  border: 12px solid #1e293b;
  border-radius: 36px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  transition: border-color 0.3s ease;
}

.mockup-card:hover .phone-mockup {
  border-color: var(--secondary);
}

.phone-speaker {
  position: absolute;
  top: 8px;
  width: 60px;
  height: 4px;
  background: #475569;
  border-radius: 2px;
  z-index: 10;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
}

.phone-screen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.phone-home-btn {
  position: absolute;
  bottom: 6px;
  width: 12px;
  height: 12px;
  border: 1px solid #475569;
  border-radius: 50%;
  z-index: 10;
}

.mockup-desc h3 {
  font-size: 1.15rem;
  color: var(--secondary);
  margin-bottom: 8px;
  font-weight: 700;
}

.mockup-desc p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

/* CTA Móvil / Próximamente */
.cta-movil {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  text-align: center;
  border: none;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.cta-movil::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(7, 172, 218, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
}

.cta-movil h2 {
  font-size: 2.2rem;
  color: white;
  border: none;
  padding: 0;
  margin-bottom: 16px;
  font-weight: 800;
}

.cta-movil p {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 32px;
}

.store-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.store-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #1e293b;
  border: 1px solid #475569;
  padding: 10px 24px;
  border-radius: 12px;
  color: white;
  min-width: 170px;
  cursor: not-allowed;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.store-badge span {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.store-badge strong {
  font-size: 1.1rem;
  color: white;
}

/* Adaptabilidad (Responsive) */
@media (max-width: 992px) {
  .info-block-movil {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-container-movil {
    order: -1;
  }
}

@media (max-width: 768px) {
  .hero-movil {
    padding: 60px 16px;
  }
  
  .hero-movil h2 {
    font-size: 2.2rem;
  }
  
  section {
    padding: 24px;
  }
  
  section h2 {
    font-size: 1.6rem;
  }
}
</style>
