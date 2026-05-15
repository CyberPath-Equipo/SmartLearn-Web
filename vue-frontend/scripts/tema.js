// =============================
//  Inicialización de variables
// =============================
const API_BASE = "http://localhost:8080/smartlearn/api";

let idMateria = localStorage.getItem("idMateria");
let nombreMateria = localStorage.getItem("nombreMateria");

document.addEventListener("DOMContentLoaded", () => {
    if (!idMateria) {
        mostrarMensaje("Materia no seleccionada");
        window.location.href = "materias.html";
        return;
    }

    document.getElementById("materiaNombre").innerHTML = nombreMateria;

    cargarTemas();
});


// =============================
//  Cargar Temas
// =============================
async function cargarTemas() {
    const API_URL = `${API_BASE}/materia/${idMateria}/temas`;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            if (response.status === 404) {
                mostrarMensaje("No hay temas registrados");
                return;
            }
            throw new Error("Error al obtener temas");
        }

        const temas = await response.json();
        pintarTablaTemas(temas);

    } catch (error) {
        console.error("Error al cargar temas:", error);
        mostrarMensaje("Error de conexión con el servidor");
    }
}


// =============================
//  Pintar tabla de temas
// =============================
function pintarTablaTemas(temas) {
    const tbody = document.getElementById("temasBody");
    tbody.innerHTML = "";

    temas.forEach(tema => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="btn_idTema" id="${tema.id}" data-nombre=${tema.nombre} style="cursor:pointer; color:#2563eb; font-weight:bold;" name="${tema.nombre}">${tema.id}</td>
            <td>${tema.nombre}</td>

            <td>
                <button class="btn-small btn-edit" 
                        onclick="mostrarFormEdit(${tema.id}, '${tema.nombre}')">
                    Editar
                </button>

                <button class="btn-small btn-delete" 
                        onclick="eliminarTema(${tema.id})">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// =============================
//  Mostrar/Ocultar Formularios
// =============================
function mostrarFormAdd() {
    document.getElementById("formBox").classList.remove("hidden");
}

function ocultarForm() {
    document.getElementById("formBox").classList.add("hidden");
    document.getElementById("temaForm").reset();
}

function mostrarFormEdit(id, nombre) {
    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;

    document.getElementById("formBoxEdit").classList.remove("hidden");
}

function ocultarFormEdit() {
    document.getElementById("formBoxEdit").classList.add("hidden");
    document.getElementById("editTemaForm").reset();
}


// =============================
//  Crear Tema
// =============================
document.getElementById("temaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById("nombreTema").value,
        idMateria: parseInt(idMateria)
    };

    try {
        const response = await fetch(`${API_BASE}/tema`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al guardar tema");

        mostrarMensaje("Tema creado correctamente");
        ocultarForm();
        cargarTemas();

    } catch (error) {
        console.error("Error creando tema:", error);
        mostrarMensaje("No se pudo guardar el tema");
    }
});


// =============================
//  Editar Tema
// =============================
document.getElementById("editTemaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;

    const data = {
        nombre: document.getElementById("editNombre").value,
        idMateria: parseInt(idMateria)
    };

    try {
        const response = await fetch(`${API_BASE}/tema/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al actualizar tema");

        mostrarMensaje("Tema actualizado correctamente");
        ocultarFormEdit();
        cargarTemas();

    } catch (error) {
        console.error("Error editando tema:", error);
        mostrarMensaje("No se pudo actualizar");
    }
});


// =============================
//  Eliminar Tema
// =============================
async function eliminarTema(idTema) {
    if (!confirm("¿Deseas eliminar este tema?")) return;

    try {
        const response = await fetch(`${API_BASE}/tema/${idTema}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al eliminar tema");

        mostrarMensaje("Tema eliminado");
        cargarTemas();

    } catch (error) {
        console.error("Error eliminando tema:", error);
        mostrarMensaje("No se pudo eliminar");
    }
}


// =============================
//  Mensajes
// =============================
function mostrarMensaje(msg) {
    const div = document.getElementById("messages");
    div.textContent = msg;
    div.classList.remove("hidden");

    setTimeout(() => div.classList.add("hidden"), 2500);
}


// =============================
//          Subtemas
// =============================
// Delegación de eventos para captar clicks en cualquier btn_idTema
document.addEventListener("click", async (e) => {

    // Verifica si se hizo click sobre un elemento con la clase btn_idTema
    if (e.target.classList.contains("btn_idTema")) {

        const idTema = e.target.id;
        const nombreTema = e.target.dataset.nombre;

        localStorage.setItem("idTema", Number(idTema));
        localStorage.setItem("nombreTema", nombreTema);

        // Redirigir a la página de subtemas con el id como parámetro
        window.location.href = `subtema.html?idMateria=${idTema}`;
    }
});