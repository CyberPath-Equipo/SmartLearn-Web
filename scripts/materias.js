document.addEventListener("DOMContentLoaded", () => {
    cargarMaterias();
});


// =========================
//  Cargar lista de materias
// =========================
async function cargarMaterias() {
    const idUsuario = localStorage.getItem("idUsuario"); // ID del usuario guardado localmente
    if (!idUsuario) {
        alert("Usuario no autenticado");
        window.location.href = "login.html";
    }
    const API_URL = `http://localhost:8080/smartlearn/api/usuario-materia/usuario/${idUsuario}/materias`;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            mostrarMensaje("Aún no hay materias registradas");
            return;
        }

        if (!response.ok) {
            throw new Error("Error al obtener materias");
        }

        const materias = await response.json();
        mostrarMaterias(materias);

    } catch (error) {
        console.error("Error al cargar materias:", error);
        mostrarMensaje("Error de conexión con el servidor");
    }
}

// ========================================
// Rellenar tabla con datos de materias
// ========================================
function mostrarMaterias(materias) {
    const tbody = document.getElementById("materiasBody");
    tbody.innerHTML = "";

    materias.forEach(materia => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td class="btn_idMateria" id="${materia.id}" data-nombre="${materia.nombre}" style="cursor:pointer; color:#2563eb; font-weight:bold;">${materia.id}</td>
            <td>${materia.nombre}</td>
            <td>${materia.descripcion ?? "Sin descripción"}</td>
            <td>
                <button class="btn-small btn-edit" onclick="mostrarFormEdit(${materia.id}, '${materia.nombre}', '${materia.descripcion ?? ""}')">
                    Editar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarMateria(${materia.id})">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

function mostrarMensaje(texto) {
    document.getElementById("materiasBody").innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center; padding: 12px;">
                ${texto}
            </td>
        </tr>
    `;
}


// ============================
// Formulario: mostrar / ocultar
// ============================
function mostrarFormAdd() {
    document.getElementById("formBox").classList.remove("hidden");
}

function ocultarForm() {
    const formCreado = document.getElementById("formBox");
    formCreado.classList.add("hidden");
    formCreado.style.display = "none";
}

let materiaIdEditando = null;
function mostrarFormEdit(id) {
    materiaIdEditando = id;
    const box = document.getElementById("formBoxEdit");
    box.classList.remove("hidden");
    box.style.display = "block";
}


function ocultarFormEdit() {
    const formEditado = document.getElementById("formBoxEdit");
    formEditado.classList.add("hidden");
    formEditado.style.display = "none";
}


// ============================
// CREAR MATERIA (POST)
// ============================
const formularioMateria = document.getElementById("subjectForm");

formularioMateria.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreMateria").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    const data = { nombre, descripcion };

    try {
        // Crear la materia
        const response = await fetch("http://localhost:8080/smartlearn/api/materia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Error al registrar materia");
            return;
        }

        // Obtener la materia recién creada
        const materiaCreada = await response.json();
        const idMateria = materiaCreada.id;

        // Obtener el id del usuario desde el token
        const idUsuario = localStorage.getItem("idUsuario");

        // Crear relación usuario–materia
        const relacion = {
            idUsuario: idUsuario,
            idMateria: idMateria
        };

        const relResponse = await fetch("http://localhost:8080/smartlearn/api/usuario-materia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(relacion)
        });

        if (!relResponse.ok) {
            alert("Materia creada, pero error al asignarla al usuario");
            return;
        }

        alert("Materia registrada y asignada correctamente");

        formularioMateria.reset();
        ocultarForm();
        cargarMaterias();

    } catch (error) {
        console.error("Error al crear materia:", error);
        alert("Error de conexión con el servidor");
    }
});


// ============================
// EDITAR MATERIA (PUT)
// ============================
const formularioEdit = document.getElementById("editForm");

formularioEdit.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Buscar materia por ID
    if (!materiaIdEditando) {
        alert("Error interno: ID inválido");
        return;
    }

    // Confirmación por seguridad
    if (!confirm("Seguro que quiere mantener los cambios en la materia?")){
        return;
    }

    const nombre = document.getElementById("nombreMateriaEdit").value.trim();
    const descripcion = document.getElementById("descripcionEdit").value.trim();

    if (nombre === "") {
        alert("El nombre no puede estar vacío");
        return;
    }

    const editData = {
        nombre,
        descripcion
    };

    try {
        const response = await fetch(
            `http://localhost:8080/smartlearn/api/materia/${materiaIdEditando}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            }
        );

        if (!response.ok) {
            throw new Error("Error al editar la materia");
        }

        alert("Materia editada correctamente");

        ocultarFormEdit();
        formularioEdit.reset();
        await cargarMaterias();

        // Limpiar ID
        materiaIdEditando = null;

    } catch (error) {
        console.error("Error al editar materia:", error);
        alert("Error de conexión con el servidor");
    }
});


// ============================
// ELIMINAR MATERIA (DELETE)
// ============================
async function eliminarMateria(id) {
    if (!confirm("¿Seguro que deseas eliminar la materia? Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/smartlearn/api/materia/${id}`, {
            method: "DELETE"
        });

        if (!response.ok && response.status !== 204) {
            throw new Error("Error al eliminar");
        }

        alert("Materia eliminada correctamente");
        cargarMaterias();

    } catch (error) {
        console.error("Error al eliminar materia:", error);
        alert("Error de conexión con el servidor");
    }
}

/// ================================
/// Entrar a los subtemas de materia
/// ================================

// Delegación de eventos para captar clicks en cualquier btn_idMateria
document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn_idMateria")) {

        const idMateria = e.target.id;
        const nombreMateria = e.target.dataset.nombre;

        localStorage.setItem("idMateria", idMateria);
        localStorage.setItem("nombreMateria", nombreMateria);

        window.location.href = `tema.html?idMateria=${idMateria}`;
    }
});


// ============================
// LOGOUT
// ============================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}