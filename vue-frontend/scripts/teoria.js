// ===============================
//   CONFIGURACIÓN
// ===============================

const API_TEORIA = "http://localhost:8080/smartlearn/api/teoria/docente";
const API_SUBTEMA = "http://localhost:8080/smartlearn/api/subtema";
const API_BASE = "http://localhost:8080/smartlearn/api";

const subtemaId = localStorage.getItem("idSubtema");
var idTeoria;

// DOM
const crearTeoriaSection = document.getElementById("crearTeoriaSection");
const teoriaSection = document.getElementById("teoriaSection");
const teoriaForm = document.getElementById("teoriaForm");
const editarTeoriaForm = document.getElementById("editarTeoriaForm");

const tituloTeoria = document.getElementById("tituloTeoriaExistente");
const contenidoTeoria = document.getElementById("contenidoTeoriaExistente");
const subtemaNombreSpan = document.getElementById("subtemaNombre");

// Estado
let teoriaActual = null;

// ===============================
//   INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    if (!subtemaId) return alert("Subtema no definido");

    obtenerNombreSubtema();
    cargarTeoria();
});

// ===============================
//   CARGAR TEORÍA
// ===============================

async function cargarTeoria() {
    try {
        const res = await fetch(`${API_SUBTEMA}/${subtemaId}/teoria`);

        if (res.status === 204 || res.status === 404) {
            mostrarCrearTeoria();
            return;
        }

        teoriaActual = await res.json();
        idTeoria = teoriaActual.id;
        ocultarTodo();
        mostrarTeoria();
        cargarEjercicios();

    } catch (e) {
        console.error(e);
    }
}

// ===============================
//   MOSTRAR TEORÍA
// ===============================

function mostrarTeoria() {
    ocultarTodo();
    teoriaSection.style.display = "block";

    tituloTeoria.textContent = teoriaActual.titulo || "Teoría del subtema";
    contenidoTeoria.textContent = teoriaActual.contenido;
}

// ===============================
//   EDITAR TEORÍA
// ===============================

function editarTeoria() {
    if (!teoriaActual) {
        alert("No hay teoría para editar");
        return;
    }
    ocultarTodo();
    editarTeoriaForm.style.display = "block";
}

function ocultarTodo() {
    crearTeoriaSection.style.display = "none";
    teoriaSection.style.display = "none";
    editarTeoriaForm.style.display = "none";
}

// ===============================
//   EJERCICIOS
// ===============================

async function cargarEjercicios() {
    try {
        const res = await fetch(`${API_SUBTEMA}/${subtemaId}/ejercicios`);
        if (res.status === 204) return;

        const ejercicios = await res.json();
        pintarTablaEjercicios(ejercicios);

    } catch (e) {
        console.error(e);
    }
}

function pintarTablaEjercicios(ejercicios) {
    const tbody = document.getElementById("ejerciciosBody");
    tbody.innerHTML = "";

    ejercicios.forEach(e => {
        let estado;
        if(e.hecho){
            estado = "Hecho";
        } else{
            estado = "Pendiente";
        }
        tbody.innerHTML += `
            <tr>
                <td onclick="irEjercicio(${e.id})" style="cursor:pointer; color:#2563eb; font-weight:bold;">${e.id}</td>
                <td>${e.nombre}</td>
                <td>${estado}</td>
                <td>
                    <button class="peligro" onclick="eliminarEjercicio(${e.id}, event)">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function eliminarEjercicio(idEjercicio, event) {
    event.stopPropagation();

    if (!confirm("¿Seguro que deseas eliminar este ejercicio?")) return;

    try {
        const response = await fetch(`${API_BASE}/ejercicio/${idEjercicio}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error();

        cargarEjercicios();

    } catch(error) {
        console.error(error);
        alert("No se pudo eliminar el ejercicio");
    }
}

// ===============================
//   NAVEGACIÓN
// ===============================

function irEjercicio(id) {
    localStorage.setItem("idEjercicio", id);
    window.location.href = "editar-ejercicio.html";
}

function crearEjercicio() {
    localStorage.setItem("idTeoria", teoriaActual.id);
    window.location.href = "crear-ejercicio.html";
}

// ===============================
//   CRUD TEORÍA
// ===============================

// CREAR
teoriaForm.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        idSubtema: subtemaId,
        titulo: document.getElementById("tituloIngresado").value,
        contenido: document.getElementById("contenidoIngresado").value
    };

    const res = await fetch(API_TEORIA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    teoriaActual = await res.json();
    mostrarTeoria();
});

// EDITAR
editarTeoriaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!teoriaActual || !teoriaActual.id) {
        alert("No hay teoría para editar");
        return;
    }

    const data = {
        contenido: document.getElementById("editarContenido").value,
        revisado: teoriaActual.revisado,
        idSubtema: parseInt(subtemaId, 5)
    };

    try {
        const res = await fetch(`${API_TEORIA}/${teoriaActual.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        teoriaActual = await res.json();

        alert("Teoría editada con éxito");
        cargarTeoria();

    } catch (error) {
        console.error(error);
        alert("Algo salió mal al editar la teoría");
    }
});

// ELIMINAR
async function eliminarTeoria() {
    if (!confirm("¿Seguro que deseas eliminar esta teoría?")) return;

    try {
        const response = await fetch(`${API_SUBTEMA}/teoria/${idTeoria}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error();

        teoriaActual = null;
        mostrarCrearTeoria();

    } catch {
        alert("No se pudo eliminar la teoría");
    }
}

function mostrarCrearTeoria() {
    ocultarTodo();

    teoriaForm.reset();

    crearTeoriaSection.style.display = "block";
    teoriaForm.style.display = "block";

    teoriaActual = null;
    idTeoria = null;
}

teoriaForm.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        idSubtema: subtemaId,
        contenido: document.getElementById("contenidoIngresado").value
    };

    const res = await fetch(API_TEORIA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        alert("No se pudo crear la teoría");
        return;
    }

    teoriaActual = await res.json();
    idTeoria = teoriaActual.id;

    mostrarTeoria();
    cargarEjercicios();
});


// ===============================
//   SUBTEMA
// ===============================

async function obtenerNombreSubtema() {
    const res = await fetch(`${API_SUBTEMA}/${subtemaId}`);
    const data = await res.json();
    subtemaNombreSpan.textContent = data.nombre;
}