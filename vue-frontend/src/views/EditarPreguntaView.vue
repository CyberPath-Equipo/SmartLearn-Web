<template>
  <div class="editar-pregunta-view">

        <!-- ========================= -->
        <!--  NOMBRE DEL EJERCICIO     -->
        <!-- ========================= -->
        <section class="card">
            <h2 id="nombreEjercicioTitulo">Nombre del ejercicio</h2>
            <p class="info-text">
                Edita la pregunta y sus opciones.
            </p>
        </section>

        <!-- ========================= -->
        <!--  EDITAR PREGUNTA          -->
        <!-- ========================= -->
        <section class="card">
            <h2>Editar pregunta</h2>

            <div class="form-group">
                <label for="enunciadoPregunta">Enunciado</label>
                <textarea
                    id="enunciadoPregunta"
                    rows="3"
                    required
                ></textarea>
            </div>
        </section>

        <!-- ========================= -->
        <!--  OPCIONES                 -->
        <!-- ========================= -->
        <section class="card">
            <h2>Opciones</h2>

            <div id="opcionesContainer">
                <!-- JS -->
            </div>

            <button class="btn-secondary" onclick="agregarOpcion()">
                + Agregar opción
            </button>
        </section>

        <!-- ========================= -->
        <!--  ACCIONES                 -->
        <!-- ========================= -->
        <section class="card action-buttons">

            <button class="btn-primary" onclick="guardarCambiosPregunta()">
                Guardar cambios
            </button>

            <button class="btn-secondary" onclick="volverAEjercicio()">
                Regresar
            </button>
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
