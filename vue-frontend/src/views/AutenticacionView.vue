<template>
  <section class="card auth-card verification-card">
      <div class="auth-card-header">
          <h2>{{ isRegistration ? 'Verificación de Cuenta' : 'Segundo Factor (2FA)' }}</h2>
          <p v-if="correo">Hemos enviado un código de 6 dígitos a <strong>{{ correo }}</strong></p>
          <p v-else>Introduce el código de 6 dígitos enviado a tu correo.</p>
      </div>

      <form @submit.prevent="handleVerify" class="auth-form">
          <div class="otp-container">
            <input 
              v-for="(digit, index) in 6" 
              :key="index"
              type="text" 
              inputmode="numeric" 
              maxlength="1" 
              class="otp-input"
              v-model="codeDigits[index]"
              ref="otpInputs"
              @input="onInput(index, $event)"
              @keydown="onKeydown(index, $event)"
              @paste="onPaste"
              :disabled="loading"
            />
          </div>

          <div v-if="!isRegistration" class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberDevice" :disabled="loading" />
              Recordar este dispositivo por 30 días
            </label>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary auth-submit" :disabled="loading || !isCodeComplete">
            <span v-if="loading" class="spinner-btn"></span>
            <span v-if="loading">Verificando...</span>
            <span v-else>Verificar Código</span>
          </button>
      </form>
      
      <div class="auth-footer verification-footer">
          <p>¿No recibiste el código? 
            <button 
              @click="resendCode" 
              class="btn-link" 
              :disabled="resendTimer > 0 || resending"
            >
              {{ resendTimer > 0 ? `Reenviar en ${resendTimer}s` : (resending ? 'Enviando...' : 'Reenviar código') }}
            </button>
          </p>
          <p class="mt-3">
            <button @click="goBack" class="btn-link text-muted">Volver</button>
          </p>
      </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const type = route.query.type || '2fa';
const tx = route.query.tx;
const correo = route.query.correo;

const isRegistration = type === 'registration';

const codeDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const rememberDevice = ref(false);

const loading = ref(false);
const errorMessage = ref('');

const resendTimer = ref(0);
const resending = ref(false);
let timerInterval = null;

onMounted(() => {
  if (!tx) {
    router.push('/login');
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const isCodeComplete = computed(() => {
  return codeDigits.value.every(d => d !== '');
});

const getCode = () => codeDigits.value.join('');

const startResendTimer = () => {
  resendTimer.value = 60;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const resendCode = async () => {
  if (resendTimer.value > 0 || resending.value) return;
  
  resending.value = true;
  errorMessage.value = '';
  
  try {
    await api.post('/usuario/2fa/resend', { transactionId: tx });
    startResendTimer();
  } catch (error) {
    errorMessage.value = 'Error al reenviar el código.';
    console.error(error);
  } finally {
    resending.value = false;
  }
};

const handleVerify = async () => {
  if (!isCodeComplete.value) return;
  
  errorMessage.value = '';
  loading.value = true;
  
  const code = getCode();

  try {
    if (isRegistration) {
      const response = await api.post('/usuario/registro/verificar', {
        transactionId: tx,
        code: code
      });
      
      if (response.data && !response.data.error) {
        alert("Cuenta verificada exitosamente. Ya puedes iniciar sesión.");
        router.push('/login');
      } else {
        errorMessage.value = 'Código incorrecto o expirado.';
      }
    } else {
      const result = await authStore.verify2fa(tx, code, rememberDevice.value);
      if (result.success) {
        router.push('/dashboard');
      } else {
        errorMessage.value = result.message || 'Código incorrecto.';
      }
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error de verificación.';
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push(isRegistration ? '/registro' : '/login');
};

const onInput = (index, event) => {
  const value = event.target.value;
  // Solo permitir números
  if (/[^0-9]/.test(value)) {
    codeDigits.value[index] = '';
    return;
  }
  
  if (value && index < 5) {
    otpInputs.value[index + 1].focus();
  }
};

const onKeydown = (index, event) => {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    otpInputs.value[index - 1].focus();
  }
};

const onPaste = (event) => {
  event.preventDefault();
  const pasteData = event.clipboardData.getData('text').trim();
  if (!/^\d+$/.test(pasteData)) return;
  
  const digits = pasteData.slice(0, 6).split('');
  digits.forEach((digit, idx) => {
    if (idx < 6) codeDigits.value[idx] = digit;
  });
  
  const focusIndex = Math.min(digits.length, 5);
  otpInputs.value[focusIndex].focus();
};
</script>

<style scoped>
.verification-card {
  max-width: 450px;
  margin: 0 auto;
}

.otp-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 25px 0;
}

.otp-input {
  width: 50px;
  height: 60px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.2s ease;
  padding: 0;
}

.otp-input:focus {
  border-color: #07ACDA;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(7, 172, 218, 0.15);
  outline: none;
}

.otp-input:disabled {
  background: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.7;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.verification-footer {
  text-align: center;
  margin-top: 20px;
}

.btn-link {
  background: none;
  border: none;
  color: #07ACDA;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
  color: #005fcc;
}

.btn-link:disabled {
  color: #a0aec0;
  cursor: not-allowed;
}

.text-muted {
  color: #718096;
}

.mt-3 {
  margin-top: 12px;
}

.spinner-btn {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
