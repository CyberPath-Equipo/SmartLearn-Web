<template>
  <section class="card dashboard-card">
      <div class="topbar">
          <h2>Dashboard Principal</h2>
      </div>
      <div id="tableContainer">
          <div style="padding: 20px;">
            <h3>Bienvenido al panel de administración de SmartLearn.</h3>
            <p>Utiliza el panel para gestionar las materias, teoría y ejercicios.</p>
            <br>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Materias</h3>
                <p class="number">12</p>
              </div>
              <div class="stat-card">
                <h3>Alumnos</h3>
                <p class="number">150</p>
              </div>
              <div class="stat-card">
                <h3>Ejercicios</h3>
                <p class="number">45</p>
              </div>
            </div>
          </div>
      </div>
  </section>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.stat-card {
  background: var(--bg);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--border);
}
.stat-card h3 {
  margin: 0 0 10px 0;
  color: var(--text);
}
.stat-card .number {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
  color: var(--accent);
}
</style>
