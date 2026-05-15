const API_BASE = "http://localhost:8080/smartlearn/api";
const API_PREGUNTA = `${API_BASE}/pregunta`;


document.addEventListener("DOMContentLoaded", () => {
    const id = obtenerIdEjercicio();
    if (!id) {
        alert("Ejercicio no válido");
        volver();
        return;
    }

    cargarEjercicio(id);

    document
        .getElementById("formEditarEjercicio")
        .addEventListener("submit", guardarCambios);
});

function obtenerIdEjercicio() {
    const params = localStorage.getItem("idEjercicio");
    return params;
}

async function cargarEjercicio(id) {
    try {
        const response = await fetch(`${API_BASE}/ejercicio/${id}`);
        if (!response.ok) throw new Error();

        const ejercicio = await response.json();

        document.getElementById("idEjercicio").value = ejercicio.id;
        document.getElementById("nombre").value = ejercicio.nombre ?? "";

        cargarPreguntas(id);
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar el ejercicio");
    }
}

async function guardarCambios(event) {
    event.preventDefault();

    const id = document.getElementById("idEjercicio").value;

    const ejercicio = {
        id: id,
        nombre: document.getElementById("nombre").value.trim(),
        idSubtema: localStorage.getItem("idSubtema")
    };

    if (!ejercicio.nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/ejercicio/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ejercicio)
        });

        if (!response.ok) throw new Error();

        alert("Ejercicio actualizado correctamente");
        volver();

    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el ejercicio");
    }
}

function volver() {
    window.location.href = "teoria.html";
}

// ===============================
//   PREGUNTAS DEL EJERCICIO
// ===============================

async function cargarPreguntas(idEjercicio) {
    try {
        const response = await fetch(`${API_BASE}/ejercicio/${idEjercicio}/preguntas`);
        if (!response.ok) throw new Error();

        const preguntas = await response.json();
        pintarTablaPreguntas(preguntas);

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las preguntas");
    }
}

function pintarTablaPreguntas(preguntas) {
    const tbody = document.getElementById("ejerciciosBody");
    tbody.innerHTML = "";

    if (!preguntas || preguntas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    No hay preguntas registradas
                </td>
            </tr>
        `;
        return;
    }

    preguntas.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.enunciado}</td>
                <td>
                    <button class="btn-secondary" onclick="editarPregunta(${p.id})">
                        Editar
                    </button>
                    <button class="peligro" onclick="eliminarPregunta(${p.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function editarPregunta(idPregunta) {
    localStorage.setItem("idPregunta", idPregunta);
    window.location.href = "editar-pregunta.html";
}

async function eliminarPregunta(idPregunta) {
    if (!confirm("¿Seguro que deseas eliminar esta pregunta?")) return;

    try {
        const response = await fetch(`${API_PREGUNTA}/${idPregunta}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error();

        alert("Pregunta eliminada correctamente");

        const idEjercicio = obtenerIdEjercicio();
        cargarPreguntas(idEjercicio);

    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar la pregunta");
    }
}