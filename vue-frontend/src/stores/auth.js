import { defineStore } from 'pinia';
import api from '../api/axios';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    async login(correo, contrasena) {
      this.logout(); // Limpiar estado antes de intentar login
      try {
        const response = await api.post('/usuario/login/docente', {
          correo,
          contrasena
        });
        console.log(response.data);
        
        const data = response.data;

        if (data.requires2fa) {
          return {
            success: true,
            requires2fa: true,
            twoFactorTransactionId: data.twoFactorTransactionId,
            twoFactorChannel: data.twoFactorChannel
          };
        }

        this.token = data.token;
        // Se guarda parcialmente antes de obtener el perfil completo
        this.user = {
          idUsuario: data.idUsuario,
          nombreCuenta: data.nombreCuenta,
          idRol: data.idRol
        };

        localStorage.setItem('token', this.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(this.user));

        // Obtener el perfil completo del usuario
        await this.getProfile(this.user.idUsuario);

        return { success: true, requires2fa: false };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message:
            error.response?.data?.error ||
            error.response?.data ||
            error.message
        };
      }
    },

    async verify2fa(transactionId, code, rememberDevice = false) {
      try {
        const response = await api.post('/usuario/2fa/verify', {
          transactionId,
          code,
          rememberDevice,
          deviceInfo: window.navigator?.userAgent || "Web Client"
        });

        const data = response.data;
        this.token = data.token;
        
        let idUsuario = data.idUsuario;
        let nombreCuenta = data.nombreCuenta;
        let idRol = data.idRol;

        if (!idUsuario && data.token) {
          const decoded = decodeJwt(data.token);
          if (decoded) {
            idUsuario = decoded.idUsuario || decoded.userId || decoded.id;
            nombreCuenta = decoded.nombreCuenta || decoded.sub;
            idRol = decoded.idRol || decoded.role || (decoded.roles && decoded.roles[0]);
          }
        }

        this.user = {
          idUsuario,
          nombreCuenta,
          idRol
        };

        localStorage.setItem('token', this.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.trustedDeviceToken) {
          localStorage.setItem('trustedDeviceToken', data.trustedDeviceToken);
        }
        localStorage.setItem('user', JSON.stringify(this.user));

        if (idUsuario) {
          await this.getProfile(idUsuario);
        }

        return { success: true };
      } catch (error) {
        console.error('Error verifying 2FA:', error);
        return {
          success: false,
          message: error.response?.data?.error || error.response?.data || error.message
        };
      }
    },

    async register(usuarioDto) {
      console.log("Entró a handleRegister");
      try {
        const response = await api.post('/usuario/registro', usuarioDto);
        return {
          success: true,
          data: response.data
        };
      } catch (error) {
        console.error('Error registrando usuario:', error);
        return {
          success: false,
          message:
            error.response?.data?.error ||
            error.response?.data ||
            error.message
        };
      }
    },

    async getProfile(idUsuario) {
      try {
        console.log('Obteniendo perfil...');
        const response = await api.get(`/usuario/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.user = { ...this.user, ...response.data };
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return false;
      }
    },

    async checkAuth() {
      if (!this.token || !this.user?.idUsuario) {
        this.logout();
        return false;
      }

      // Valida que el token aún funcione intentando obtener el perfil
      const isValid = await this.getProfile(this.user.idUsuario);
      if (!isValid) {
        this.logout();
        return false;
      }

      return true;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('trustedDeviceToken');
      localStorage.removeItem('user');
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    // Asumimos rol 1 = Admin, rol 2 = Docente (ajustar si los IDs reales son diferentes)
    isAdmin: (state) => state.user?.idRol === 1 || state.user?.rol === 'ADMIN',
    isDocente: (state) => state.user?.idRol === 2 || state.user?.rol === 'DOCENTE',
  }
});
