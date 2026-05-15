<template>
  <div class="crear-ejercicio-view">

        <section class="card">
            <h2>Datos del ejercicio</h2>
            <form id="ejercicioForm">
                <div class="form-group">
                    <label for="nombreEjercicio">Nombre del ejercicio</label>
                    <input type="text"
                           id="nombreEjercicio"
                           name="nombreEjercicio"
                           placeholder="Ej. Ejercicio de variables"
                           required aria-required="true"
                           autocomplete="off"> <!-- o no? -->
                </div>
                <button type="submit" class="btn-primary full-width">
                    Guardar ejercicio
                </button>
            </form>
        </section>

    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
/* Estilos específicos de la vista */
</style>
