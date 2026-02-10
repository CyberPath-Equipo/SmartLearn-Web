// ===============================
//   CONFIGURACIÓN
// ===============================

const API_PREGUNTA = "http://localhost:8080/smartlearn/api/pregunta";
const API_OPCION   = "http://localhost:8080/smartlearn/api/opcion";

const idPregunta = localStorage.getItem("idPregunta");
const nombreEjercicio = localStorage.getItem("nombreEjercicio");
const idEjercicio = localStorage.getItem("idEjercicio");

// Estado
let contadorOpciones = 0;

// ===============================
//   CARGA INICIAL
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
    if (!idPregunta) {
        alert("Pregunta no encontrada");
        volverAEjercicio();
        return;
    }

    document.getElementById("nombreEjercicioTitulo").textContent = nombreEjercicio;

    await cargarPregunta();
    await cargarOpciones();
});

// ===============================
//   CARGAR PREGUNTA
// ===============================

async function cargarPregunta() {
    const res = await fetch(`${API_PREGUNTA}/${idPregunta}`);
    if (!res.ok) throw new Error();

    const pregunta = await res.json();
    document.getElementById("enunciadoPregunta").value = pregunta.enunciado;
}

// ===============================
//   CARGAR OPCIONES
// ===============================

async function cargarOpciones() {
    const res = await fetch(`${API_PREGUNTA}/${idPregunta}/opciones`);
    if (!res.ok) throw new Error();

    const opciones = await res.json();

    opciones.forEach(op => agregarOpcion(op));
}

// ===============================
//   OPCIONES
// ===============================

function agregarOpcion(opcion = null) {
    contadorOpciones++;

    const container = document.getElementById("opcionesContainer");
    const div = document.createElement("div");
    div.classList.add("form-group", "opcion-item");

    div.dataset.idOpcion = opcion?.id ?? "";

    div.innerHTML = `
        <label>Opción ${contadorOpciones}</label>

        <div style="display:flex; align-items:center; gap:10px;">
            <input type="radio"
                   name="opcionCorrecta"
                   ${opcion?.correcta ? "checked" : ""}>

            <input type="text"
                   class="opcion-texto"
                   value="${opcion?.texto ?? ""}"
                   required>

            <button class="peligro" onclick="eliminarOpcion(this, ${opcion?.id ?? ""})">X</button>
        </div>
    `;

    container.appendChild(div);
}

async function eliminarOpcion(btn, idOpcion) {
    if (!confirm("¿Deseas eliminar esta opción?")) return;

    const div = btn.closest(".opcion-item");

    try {
        if (idOpcion) {
            const response = await fetch(`${API_OPCION}/${idOpcion}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error();
        }

        div.remove();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar la opción");
    }
}


// ===============================
//   GUARDAR CAMBIOS
// ===============================

async function guardarCambiosPregunta() {
    const enunciado = document.getElementById("enunciadoPregunta").value.trim();
    const opciones = document.querySelectorAll(".opcion-item");
    const opcionCorrecta = document.querySelector("input[name='opcionCorrecta']:checked");

    const data = {
        idEjercicio: idEjercicio,
        enunciado: enunciado
    };

    if (!enunciado || opciones.length < 2 || !opcionCorrecta) {
        alert("Completa correctamente la pregunta");
        return;
    }

    try {
        // =========================
        // 1. UPDATE PREGUNTA
        // =========================
        await fetch(`${API_PREGUNTA}/${idPregunta}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // =========================
        // 2. UPDATE OPCIONES
        // =========================
        const promises = [];

        opciones.forEach((div, index) => {
            const idOpcion = div.dataset.idOpcion;
            const texto = div.querySelector(".opcion-texto").value.trim();
            const correcta = div.querySelector("input[type=radio]").checked;

            if (!texto) return;

            const body = JSON.stringify({
                texto,
                correcta,
                idPregunta
            });

            if (idOpcion) {
                promises.push(
                    fetch(`${API_OPCION}/${idOpcion}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body
                    })
                );
            } else {
                promises.push(
                    fetch(API_OPCION, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body
                    })
                );
            }
        });

        await Promise.all(promises);

        alert("Pregunta actualizada correctamente");
        volverAEjercicio();

    } catch (error) {
        console.error(error);
        alert("Error al guardar los cambios");
    }
}

// ===============================
//   NAVEGACIÓN
// ===============================

function volverAEjercicio() {
    window.location.href = "editar-ejercicio.html";
}