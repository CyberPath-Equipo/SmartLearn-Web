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
      <div v-if="successMessage" class="auth-success">{{ successMessage }}</div>
      
      <div class="auth-footer">
          <p>¿Ya tienes una cuenta? <router-link to="/auth/login" class="auth-link">Inicia sesión</router-link></p>
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
const successMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  const payload = {
    nombreCuenta: nombre.value,
    correo: correo.value,
    contrasena: contrasena.value,
    idRol: 3 // Rol predertiminado para docente
  };

  const result = await authStore.register(payload);

  if (!result.success) {
    errorMessage.value = result.message || 'No se pudo registrar el usuario';
    return;
  }

  // Guarda al usuario en local storage
  if (result.data && result.data.nombreCuenta) {
    localStorage.setItem("usuario", result.data.nombreCuenta);
  }

  successMessage.value = result.data?.message || 'Registro exitoso. Revisa tu correo para verificar tu cuenta.';
  // Redirigir al login después de un registro exitoso
  setTimeout(() => {
    router.push('/auth/login');
  }, 1200);
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
.auth-success {
  color: #155724;
  background-color: #d4edda;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.95rem;
  border: 1px solid #c3e6cb;
}
</style>
