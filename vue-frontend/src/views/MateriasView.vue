<template>
  <div class="materias-view">

        <section class="card dashboard-card">
            <div class="topbar">
                <h2>Materias disponibles</h2>
                <button id="btnAdd" class="btn-primary" onclick="mostrarFormAdd()">+ Nueva materia</button>
                <div id="formBox" class="hidden">
                    <form id="subjectForm">
                        <input id="nombreMateria" type="text" placeholder="Nombre de la materia" required />
                        <input id="descripcion" type="text" placeholder="Descripción de la materia" />
                        <button type="submit" class="btn-primary">Guardar</button>
                    </form>
                </div>
                <div id="formBoxEdit" class="hidden">
                    <form id="editForm">
                        <input id="nombreMateriaEdit" type="text" placeholder="Nombre de la materia" required />
                        <input id="descripcionEdit" type="text" placeholder="Descripción de la materia" />
                        <button type="submit" class="btn-primary">Guardar</button>
                    </form>
                </div>
            </div>

            <!-- Tabla que se llenará desde JavaScript -->
            <div id="tableContainer">
                <table id="materiasTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>

                    <tbody id="materiasBody">
                    </tbody>
                </table>
            </div>
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
