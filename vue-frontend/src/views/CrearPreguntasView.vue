<template>
  <div class="crear-preguntas-view">

        <!-- ========================= -->
        <!--  NOMBRE DEL EJERCICIO     -->
        <!-- ========================= -->
        <section class="card">
            <h2 id="nombreEjercicioTitulo">Nombre del ejercicio</h2>
            <p class="info-text">
                Crea las preguntas y opciones correspondientes a este ejercicio.
            </p>
        </section>

        <!-- ========================= -->
        <!--  CREAR / EDITAR PREGUNTA  -->
        <!-- ========================= -->
        <section class="card">
            <h2>Pregunta</h2>
            <div class="form-group">
                <label for="enunciadoPregunta">Enunciado</label>
                <textarea
                    id="enunciadoPregunta"
                    name="enunciadoPregunta"
                    rows="3"
                    placeholder="Escribe la pregunta aquí..."
                    required
                ></textarea>
            </div>
        </section>

        <!-- ========================= -->
        <!--  OPCIONES                 -->
        <!-- ========================= -->
        <section class="card">
            <h2>Opciones</h2>

            <div id="opcionesContainer" aria-live="polite">
                <!-- JS insertará opciones dinámicamente -->
            </div>

            <button class="btn-secondary" onclick="agregarOpcion()">
                + Agregar opción
            </button>
        </section>

        <!-- ========================= -->
        <!--  ACCIONES                 -->
        <!-- ========================= -->
        <section class="card action-buttons">

            <button class="btn-primary" onclick="guardarPregunta()">
                Guardar pregunta
            </button>

            <button class="btn-secondary" onclick="nuevaPregunta()">
                Añadir otra pregunta
            </button>

            <button class="peligro" onclick="volverATeoria()">
                Regresar a teoría
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
