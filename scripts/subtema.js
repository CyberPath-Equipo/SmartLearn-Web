// =============================
//  Inicialización
// =============================
const API_BASE = "http://localhost:8080/smartlearn/api";

let idTema = localStorage.getItem("idTema");
let nombreTema = localStorage.getItem("nombreTema");

document.addEventListener("DOMContentLoaded", () => {
    if (!idTema) {
        mostrarMensaje("Tema no seleccionado");
        window.location.href = "tema.html";
        return;
    }

    // Mostrar nombre del tema
    document.getElementById("temaNombre").innerHTML = nombreTema;

    console.log("Tipo de idTema:", typeof idTema, "Valor:", idTema);

    cargarSubtemas();
});


// =============================
//  Cargar Subtemas
// =============================
async function cargarSubtemas() {
    const API_URL = `${API_BASE}/tema/${idTema}/subtemas`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            if (response.status === 404) {
                mostrarMensaje("No hay subtemas aún");
                return;
            }
            throw new Error("Error obteniendo subtemas");
        }

        const subtemas = await response.json();
        if (Array.isArray(subtemas) && subtemas.length > 0) {
            pintarTabla(subtemas);
        } else {
            mostrarMensaje("No hay subtemas aún");
        }

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error cargando subtemas");
    }
}


// =============================
//  Pintar tabla
// =============================
function pintarTabla(subtemas) {
    const tbody = document.getElementById("subtemasBody");
    tbody.innerHTML = "";

    subtemas.forEach(subtema => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <!-- ID clickeable en azul igual a temas -->
            <td class="btn_idSubtema" 
                id="${subtema.id}" 
                data-nombre="${subtema.nombre}"
                style="cursor:pointer; color:#2563eb; font-weight:bold;"
                onclick="abrirTeoria(${subtema.id}, '${subtema.nombre}')">
                ${subtema.id}
            </td>

            <td>${subtema.nombre}</td>

            <td>
                <button class="btn-small btn-edit"
                        onclick="mostrarFormEdit(${subtema.id}, '${subtema.nombre}')">
                    Editar
                </button>

                <button class="btn-small btn-delete"
                        onclick="eliminarSubtema(${subtema.id})">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}



// =============================
//  Navegar a teorías del subtema
// =============================
function abrirTeoria(idSubtema, nombreSubtema) {
    localStorage.setItem("idSubtema", idSubtema);
    localStorage.setItem("nombreSubtema", nombreSubtema);

    window.location.href = "teoria.html";
}


// =============================
//  Mostrar/Ocultar Formularios
// =============================
function mostrarFormAdd() {
    document.getElementById("formBox").classList.remove("hidden");
}

function ocultarForm() {
    document.getElementById("formBox").classList.add("hidden");
    document.getElementById("subtemaForm").reset();
}

function mostrarFormEdit(id, nombre) {
    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;

    document.getElementById("formBoxEdit").classList.remove("hidden");
}

function ocultarFormEdit() {
    document.getElementById("formBoxEdit").classList.add("hidden");
    document.getElementById("editSubtemaForm").reset();
}


// =============================
//  Crear Subtema
// =============================
document.getElementById("subtemaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
    nombre: document.getElementById("nombreSubtema").value,
    idTema: idTema
    };


    try {
        const response = await fetch(`${API_BASE}/subtema`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al guardar subtema");

        mostrarMensaje("Subtema creado");
        ocultarForm();
        cargarSubtemas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo guardar");
    }
});


// =============================
//  Editar Subtema
// =============================
document.getElementById("editSubtemaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;

    const data = {
        nombre: document.getElementById("editNombre").value,
        idTema: parseInt(idTema)
    };

    try {
        const response = await fetch(`${API_BASE}/subtema/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error editando subtema");

        mostrarMensaje("Subtema actualizado");
        ocultarFormEdit();
        cargarSubtemas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo actualizar");
    }
});


// =============================
//  Eliminar Subtema
// =============================
async function eliminarSubtema(id) {
    if (!confirm("¿Eliminar este subtema?")) return;

    try {
        const response = await fetch(`${API_BASE}/subtema/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error eliminando subtema");

        mostrarMensaje("Subtema eliminado");
        cargarSubtemas();

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al eliminar");
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
