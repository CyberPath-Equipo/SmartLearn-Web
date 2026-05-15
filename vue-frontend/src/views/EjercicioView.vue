<template>
  <div class="ejercicio-view">

        <!-- =========================
             CREAR EJERCICIO
        ========================== -->
        <section id="crearEjercicioSection" class="card hidden">
            <h2>Crear ejercicio</h2>

            <form id="crearEjercicioForm">

                <!-- PREGUNTA -->
                <div class="form-group">
                    <label for="enunciadoPregunta">Pregunta</label>
                    <textarea id="enunciadoPregunta" rows="4" placeholder="Escribe la pregunta del ejercicio..." required></textarea>
                </div>

                <!-- OPCIONES -->
                <div class="form-group">
                    <label>Opciones de respuesta</label>

                    <div id="opcionesContainer" class="opciones-grid">

                        <!-- Opción base -->
                        <div class="opcion-item">
                            <input type="text" placeholder="Texto de la opción" class="opcion-texto" required>
                            <div class="checkbox-area">
                                <label class="checkbox-label"> <input type="checkbox" class="opcion-correcta">Correcta</label>
                            </div>
                        </div>

                    </div>

                    <button type="button" class="btn-secondary" onclick="agregarOpcion()">+ Agregar opción</button>
                </div>

                <button type="submit" class="btn-primary">+ Crear ejercicio</button>

            </form>
        </section>

        <!-- =========================
             EJERCICIO EXISTENTE
        ========================== -->
        <section id="ejercicioExistenteSection" class="card hidden">
            <h2>Ejercicio existente</h2>

            <p class="info-text">
                Esta teoría ya tiene un ejercicio registrado.
            </p>

            <div class="action-buttons">
                <button class="btn-primary" onclick="consultarEjercicio()">Consultar</button>
                <button class="btn-secondary" onclick="editarEjercicio()">Editar</button>
                <button class="peligro" onclick="eliminarEjercicio()">Eliminar</button>
            </div>
        </section>

        <!-- =========================
             CONSULTAR EJERCICIO
        ========================== -->
        <section id="consultarEjercicioSection" class="card hidden">
            <h2>Ejercicio</h2>

            <p id="preguntaTexto" class="texto-teoria"></p>

            <ul id="listaOpciones" class="lista-opciones">
                <!-- JS inyecta opciones -->
                <!--
                <li class="opcion">
                    <span>Texto opción</span>
                    <span class="badge-correcta">Correcta</span>
                </li>
                -->
            </ul>

            <hr>

            <div class="action-buttons">
                <button class="btn-secondary" onclick="editarEjercicio()">Editar</button>
                <button class="btn-secondary" onclick="mostrarOpcionesEjercicio()">Cancelar</button>
                <button class="peligro" onclick="eliminarEjercicio()">Eliminar</button>
            </div>
        </section>

        <!-- =========================
             EDITAR EJERCICIO
        ========================== -->
        <section id="editarEjercicioSection" class="card hidden">
            <h2>Editar ejercicio</h2>

            <form id="editarEjercicioForm">

                <div class="form-group">
                    <label for="editarPregunta">Pregunta</label>
                    <textarea id="editarPregunta"
                              rows="4"
                              required></textarea>
                </div>

                <div class="form-group">
                    <label>Opciones</label>

                    <div id="editarOpcionesContainer">
                        <!-- JS carga opciones existentes -->
                    </div>

                    <button type="button" class="btn-secondary" onclick="agregarOpcionEditar()">+ Agregar opción</button>
                </div>

                <button type="submit" class="btn-primary">Guardar cambios</button>

                <button type="button" class="btn-secondary" onclick="mostrarOpcionesEjercicio()"> Cancelar </button>

                <button type="button" class="peligro" onclick="eliminarEjercicio()">Eliminar</button>

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
