import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    async login(correo, contrasena) {
      try {
        const response = await api.post('/usuario/login/docente', {
          correo,
          contrasena
        });
        console.log(response.data);
        
        const data = response.data;

        this.token = data.token;
        // Se guarda parcialmente antes de obtener el perfil completo
        this.user = {
          idUsuario: data.idUsuario,
          nombreCuenta: data.nombreCuenta,
          idRol: data.idRol
        };

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Obtener el perfil completo del usuario
        await this.getProfile(this.user.idUsuario);

        return { success: true };
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

    async register(usuarioDto) {
      console.log("Entró a handleRegister");
      console.log(authStore);
      console.log(authStore.register);
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
