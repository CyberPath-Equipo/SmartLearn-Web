<template>
  <section class="card auth-card">
      <div class="auth-card-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de Smart Learn</p>
      </div>
      <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
              <label for="correo">Correo electrónico</label>
              <input type="email" id="correo" v-model="correo" placeholder="ejemplo@correo.com" required />
          </div>
          <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" v-model="password" placeholder="Ingresa tu contraseña" required />
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary auth-submit" :disabled="loading">
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
      </form>
      
      <div class="auth-footer">
          <p>¿Aún no tienes una cuenta? <router-link to="/registro" class="auth-link">Regístrate aquí</router-link></p>
      </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const correo = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;
  
  const result = await authStore.login(correo.value, password.value);
  
  loading.value = false;
  
  if (result.success) {
    router.push('/dashboard');
  } else {
    errorMessage.value = result.message;
  }
};
</script>

<style scoped>
.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.9rem;
}
</style>
