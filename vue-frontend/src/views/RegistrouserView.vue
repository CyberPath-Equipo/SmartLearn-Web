<template>
  <section class="card auth-card">
      <div class="auth-card-header">
          <h2>Crea tu Cuenta</h2>
          <p>Únete a Smart Learn y comienza a aprender</p>
      </div>
      <form id="loginForm" name="formLogIn" class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
              <label for="nombre">Nombre completo</label>
              <input v-model="nombre" type="text" id="nombre" placeholder="Tu nombre y apellidos" required />
          </div>
          <div class="form-group">
              <label for="correo">Correo electrónico</label>
              <input v-model="correo" type="email" id="correo" placeholder="ejemplo@correo.com" required />
          </div>
          <div class="form-group">
              <label for="contrasena">Contraseña</label>
              <input v-model="contrasena" type="password" id="contrasena" placeholder="Crea una contraseña segura" required />
          </div>
          <button type="submit" class="btn-primary auth-submit">Registrarme</button>
      </form>
      <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      
      <div class="auth-footer">
          <p>¿Ya tienes una cuenta? <router-link to="/login" class="auth-link">Inicia sesión</router-link></p>
      </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const nombre = ref('');
const correo = ref('');
const contrasena = ref('');
const errorMessage = ref('');
import api from '../api/axios';

const handleRegister = async () => {
  console.log("CLICK FUNCIONA");

  try {
    const response = await api.post('/usuario/registro', {
      nombreCuenta: nombre.value,
      correo: correo.value,
      contrasena: contrasena.value,
      idRol: 2
    });

    if (response.status === 201 || response.status === 202) {
      router.push('/auth/login');
    } else {
      errorMessage.value = 'Error en el registro. Por favor, intenta nuevamente.';
    }
  } catch (e) {
    errorMessage.value = e.response?.data?.error || 'Error en el registro. Por favor, intenta nuevamente.';
    console.error(e);
  }
};
</script>

<style scoped>
.auth-error {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.95rem;
  border: 1px solid #f5c6cb;
}
</style>
