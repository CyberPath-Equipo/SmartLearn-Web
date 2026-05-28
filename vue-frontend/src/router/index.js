import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '../layouts/AuthLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory('web'),
  routes: [
    {
      path: '/',
      redirect: '/smartlearn'
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: '/registro',
          name: 'registro',
          component: () => import('../views/RegistrouserView.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: '/autenticacion',
          name: 'autenticacion',
          component: () => import('../views/AutenticacionView.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: '/privacidad',
          name: 'privacidad',
          component: () => import('../views/AvisoprivacidadView.vue')
        }
      ]
    },
    {
      path: '/smartlearn',
      component: () => import('../components/NavBarPrincipal.vue'),
      children: [
        {
          path: '',
          name: 'smartlearn',
          component: () => import('../views/SmartlearnView.vue')
        },
        {
          path: 'movil',
          name: 'smartlearn-movil',
          component: () => import('../views/SmartlearnMovilView.vue')
        }
      ]
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true }, // Toda esta sección requiere auth
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'materias',
          name: 'materias',
          component: () => import('../views/MateriasView.vue')
        },
        {
          path: 'tema/:idMateria/:nombreMateria',
          name: 'tema',
          component: () => import('../views/TemaView.vue')
        },
        {
          path: 'subtema/:idTema/:nombreTema',
          name: 'subtema',
          component: () => import('../views/SubtemaView.vue')
        },
        {
          path: 'teoria/:idSubtema/:nombreSubtema',
          name: 'teoria',
          component: () => import('../views/TeoriaView.vue')
        },
        {
          path: 'ejercicio',
          name: 'ejercicio',
          component: () => import('../views/EjercicioView.vue')
        },
        {
          path: 'crear-ejercicio',
          name: 'crear-ejercicio',
          component: () => import('../views/CrearEjercicioView.vue')
        },
        {
          path: 'crear-preguntas',
          name: 'crear-preguntas',
          component: () => import('../views/CrearPreguntasView.vue')
        },
        {
          path: 'editar-ejercicio',
          name: 'editar-ejercicio',
          component: () => import('../views/EditarEjercicioView.vue')
        },
        {
          path: 'editar-pregunta',
          name: 'editar-pregunta',
          component: () => import('../views/EditarPreguntaView.vue')
        },
        {
          path: 'usuario',
          name: 'usuario',
          component: () => import('../views/UsuarioView.vue')
          // Accesible para cualquier usuario autenticado (requiresAuth heredado del padre)
        }
      ]
    }
  ]
});

// Guardias de navegación globales
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Validar si requiere ser invitado (login, registro)
  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/dashboard');
  }

  // Validar si requiere autenticación (Dashboard y paneles)
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/auth/login');
  }

  // Opcional: si la ruta requiere autenticación, verificamos que el token siga vivo
  if (to.meta.requiresAuth && isAuthenticated) {
    const isValid = await authStore.checkAuth();
    if (!isValid) {
      return next('/auth/login');
    }

    // Verificación de Roles (si la ruta tiene restricción específica)
    if (to.meta.roles && to.meta.roles.length > 0) {
      const isAuthorized = to.meta.roles.some(role => {
        if (role === 'ADMIN') return authStore.isAdmin;
        if (role === 'DOCENTE') return authStore.isDocente;
        return false;
      });

      if (!isAuthorized) {
        // Redirigir al dashboard general si no tiene permisos
        return next('/dashboard');
      }
    }
  }

  next();
});

export default router;