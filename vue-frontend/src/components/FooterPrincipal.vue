<template>
  <footer role="contentinfo" class="sl-main-footer">
    <!-- Glow ambiental superior -->
    <div class="footer-ambient-glow" aria-hidden="true"></div>

    <div class="footer-container">
      <div class="footer-grid">
        <!-- Columna 1: Marca y Misión -->
        <div class="footer-col footer-brand-col">
          <router-link to="/smartlearn" class="footer-brand" aria-label="Smart Learn - Ir a Inicio">
            <div class="footer-logo-wrap">
              <img src="/images/Blanco_sin_fondo_Smart_Learn_logo.png" alt="Logo de Smart Learn" class="footer-logo" />
            </div>
            <div class="footer-brand-text">
              <span class="footer-brand-title">Smart Learn</span>
              <span class="footer-brand-subtitle">Potenciando tu aprendizaje</span>
            </div>
          </router-link>
          
          <p class="footer-mission-text">
            Plataforma educativa inclusiva diseñada para derribar barreras en el aprendizaje mediante tecnología asistiva, lectura por voz interactiva y cumplimiento integral del estándar <strong>WCAG 2.2 AA</strong>.
          </p>

          <div class="footer-entity-chip">
            <span class="entity-status-pulse" aria-hidden="true"></span>
            <span>Un desarrollo oficial de <strong>CyberPath S.A.S.</strong></span>
          </div>
        </div>

        <!-- Columna 2: Ecosistema -->
        <div class="footer-col footer-links-col">
          <h3 class="footer-heading">Ecosistema</h3>
          <ul class="footer-links-list">
            <li>
              <router-link to="/smartlearn" class="footer-nav-link">
                <SlIcon name="book" :size="16" />
                <span>Sobre Smart Learn Web</span>
              </router-link>
            </li>
            <li>
              <router-link to="/smartlearn/movil" class="footer-nav-link">
                <SlIcon name="phone" :size="16" />
                <span>Smart Learn Móvil</span>
              </router-link>
            </li>
            <li>
              <router-link to="/login" class="footer-nav-link">
                <SlIcon name="login" :size="16" />
                <span>Inicio de Sesión</span>
              </router-link>
            </li>
            <li>
              <router-link to="/registro" class="footer-nav-link">
                <SlIcon name="user" :size="16" />
                <span>Registro de Usuario</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Accesibilidad & Legal -->
        <div class="footer-col footer-links-col">
          <h3 class="footer-heading">Inclusión & Legal</h3>
          <ul class="footer-links-list">
            <li>
              <router-link to="/privacidad" class="footer-nav-link">
                <SlIcon name="shield-check" :size="16" />
                <span>Aviso de Privacidad</span>
              </router-link>
            </li>
            <li>
              <router-link to="/smartlearn" class="footer-nav-link">
                <SlIcon name="accessibility" :size="16" />
                <span>Estándar WCAG 2.2 AA</span>
              </router-link>
            </li>
            <li>
              <router-link to="/smartlearn" class="footer-nav-link">
                <SlIcon name="target" :size="16" />
                <span>Misión y Compromiso</span>
              </router-link>
            </li>
            <li>
              <router-link to="/smartlearn/movil" class="footer-nav-link">
                <SlIcon name="sparkles" :size="16" />
                <span>Guía de Accesibilidad Móvil</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Contacto & Redes Oficiales -->
        <div class="footer-col footer-contact-col">
          <h3 class="footer-heading">Contacto & Redes</h3>
          <p class="footer-contact-note">
            ¿Tienes dudas, sugerencias o requieres soporte sobre accesibilidad?
          </p>

          <a href="mailto:cyberpathcontacto@gmail.com" class="footer-email-card" aria-label="Enviar correo electrónico a CyberPath">
            <div class="email-icon-box">
              <SlIcon name="mail" :size="18" />
            </div>
            <div class="email-text-box">
              <span class="email-label">Escríbenos a soporte</span>
              <strong class="email-address">cyberpathcontacto@gmail.com</strong>
            </div>
          </a>

          <div class="footer-social-wrapper">
            <span class="social-label">Canales Oficiales:</span>
            <div class="social-pills-row">
              <a 
                href="https://instagram.com/cyberpath_oficial/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="social-pill instagram-pill"
                aria-label="Seguir a CyberPath en Instagram"
              >
                <span class="social-icon-box">
                  <SlIcon name="instagram" :size="18" />
                </span>
                <span>Instagram</span>
              </a>

              <a 
                href="https://www.youtube.com/@CyberPath_oficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="social-pill youtube-pill"
                aria-label="Suscribirse al canal de YouTube de CyberPath"
              >
                <span class="social-icon-box">
                  <SlIcon name="youtube" :size="18" />
                </span>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra Inferior / Legal / Certificados -->
      <div class="footer-bottom-bar">
        <div class="footer-bottom-left">
          <p class="footer-copyright">
            &copy; 2026 <strong>Smart Learn</strong>. Plataforma desarrollada y protegida por <strong>CyberPath S.A.S.</strong>
          </p>
          <p class="footer-made-in">
            Hecho con pasión en México 🇲🇽 · Por una educación inclusiva, equitativa y sin barreras.
          </p>
        </div>

        <div class="footer-bottom-right">
          <div class="footer-badge-pill">
            <span class="badge-dot-green"></span>
            <span>WCAG 2.2 Nivel AA</span>
          </div>
          <div class="footer-badge-pill">
            <span class="badge-dot-blue"></span>
            <span>Tecnología Asistiva Activa</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Purely presentational footer component.
</script>

<style scoped>
.sl-main-footer {
  background: #08111e !important;
  color: #94a3b8 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  padding: 64px 28px 32px !important;
  position: relative !important;
  overflow: hidden !important;
  font-family: inherit;
}

.sl-main-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #07acda 30%, #254ca8 70%, transparent);
}

.footer-ambient-glow {
  position: absolute;
  top: -120px;
  left: 20%;
  width: 600px;
  height: 240px;
  background: radial-gradient(ellipse at center, rgba(7, 172, 218, 0.12), transparent 70%);
  pointer-events: none;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.6fr;
  gap: 40px;
  padding-bottom: 44px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Columna Marca */
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none !important;
  margin-bottom: 16px;
}

.footer-logo-wrap {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #07acda, #254ca8);
  box-shadow: 0 6px 16px rgba(7, 172, 218, 0.35);
  flex-shrink: 0;
}

.footer-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.footer-brand-text {
  display: flex;
  flex-direction: column;
}

.footer-brand-title {
  color: #ffffff !important;
  font-size: 1.35rem;
  font-weight: 850;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.footer-brand-subtitle {
  color: #38bdf8 !important;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

.footer-mission-text {
  color: #cbd5e1 !important;
  font-size: 0.88rem;
  line-height: 1.7;
  margin-bottom: 20px;
  max-width: 40ch;
}

.footer-mission-text strong {
  color: #ffffff;
}

.footer-entity-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 0.78rem;
}

.footer-entity-chip strong {
  color: #ffffff;
}

.entity-status-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #07acda;
  box-shadow: 0 0 10px #07acda;
}

/* Encabezados y Enlaces */
.footer-heading {
  color: #ffffff !important;
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: 0.02em;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.footer-heading::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 24px;
  height: 2.5px;
  background: #07acda;
  border-radius: 2px;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1 !important;
  text-decoration: none !important;
  font-size: 0.88rem;
  font-weight: 550;
  transition: color 150ms cubic-bezier(0.23, 1, 0.32, 1), transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
}

.footer-nav-link:hover {
  color: #38bdf8 !important;
  transform: translateX(4px);
}

/* Columna Contacto */
.footer-contact-note {
  color: #94a3b8 !important;
  font-size: 0.84rem;
  margin-bottom: 14px;
  line-height: 1.5;
}

.footer-email-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-decoration: none !important;
  color: inherit;
  margin-bottom: 18px;
  transition: all 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

.footer-email-card:hover {
  background: rgba(7, 172, 218, 0.12);
  border-color: rgba(7, 172, 218, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(7, 172, 218, 0.2);
}

.email-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(7, 172, 218, 0.2);
  color: #38bdf8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.email-text-box {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.email-label {
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.email-address {
  font-size: 0.84rem;
  color: #f8fafc !important;
  font-weight: 700;
  word-break: break-all;
}

/* Redes Sociales */
.social-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 10px;
  font-weight: 700;
}

.social-pills-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 650;
  text-decoration: none !important;
  color: #f1f5f9 !important;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  transition: all 160ms cubic-bezier(0.23, 1, 0.32, 1);
}

.social-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.social-pill:active {
  transform: translateY(0) scale(0.97);
}

.instagram-pill:hover {
  background: linear-gradient(45deg, rgba(240, 148, 51, 0.25), rgba(220, 39, 67, 0.25) 50%, rgba(188, 24, 136, 0.25));
  border-color: #e1306c;
  color: #ffffff !important;
}

.youtube-pill:hover {
  background: rgba(255, 0, 0, 0.22);
  border-color: #ff0000;
  color: #ffffff !important;
}

.social-icon-box {
  display: grid;
  place-items: center;
}

/* Barra Inferior */
.footer-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 28px;
  flex-wrap: wrap;
}

.footer-copyright {
  color: #cbd5e1 !important;
  font-size: 0.84rem;
  margin: 0 0 4px;
}

.footer-copyright strong {
  color: #ffffff;
}

.footer-made-in {
  color: #94a3b8 !important;
  font-size: 0.78rem;
  margin: 0;
}

.footer-bottom-right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.footer-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.76rem;
  font-weight: 650;
  color: #e2e8f0;
}

.badge-dot-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.badge-dot-blue {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #07acda;
  box-shadow: 0 0 8px #07acda;
}

/* Responsividad */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .sl-main-footer {
    padding: 44px 18px 24px !important;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .footer-bottom-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
