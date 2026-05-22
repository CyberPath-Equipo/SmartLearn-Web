<template>
  <div class="registroUser-view">

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
    
  </div>
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

  successMessage.value = result.data?.message || 'Registro exitoso. Revisa tu correo para verificar tu cuenta.';
  // Redirigir al login después de un registro exitoso
  setTimeout(() => {
    router.push('/auth/login');
  }, 1200);
};
</script>

<style scoped>
/* Estilos específicos de la vista */
</style>
