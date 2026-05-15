// ===============================
//   CONFIGURACIÓN
// ===============================

const API_EJERCICIO = "http://localhost:8080/smartlearn/api/ejercicio";
const API_PREGUNTA  = "http://localhost:8080/smartlearn/api/pregunta";
const API_OPCION    = "http://localhost:8080/smartlearn/api/opcion";

const idEjercicio = localStorage.getItem("idEjercicio");
const nombreEjercicio = localStorage.getItem("nombreEjercicio");

// Estado actual
let preguntaActualId = null;
let contadorOpciones = 0;

// ===============================
//   CARGA INICIAL
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    if (!idEjercicio) {
        alert("Ejercicio no encontrado");
        volverATeoria();
        return;
    }

    document.getElementById("nombreEjercicioTitulo").textContent = nombreEjercicio;
    agregarOpcion(); // Al menos una opción inicial
});

// ===============================
//   OPCIONES
// ===============================

function agregarOpcion() {
    contadorOpciones++;

    const container = document.getElementById("opcionesContainer");

    const div = document.createElement("div");
    div.classList.add("form-group", "opcion-item");

    div.innerHTML = `
        <label>Opción ${contadorOpciones}</label>

        <div style="display:flex; align-items:center; gap:10px;">
            <input type="radio"
                   name="opcionCorrecta"
                   value="${contadorOpciones}">

            <input type="text"
                   class="opcion-texto"
                   placeholder="Texto de la opción"
                   required>
        </div>
    `;

    container.appendChild(div);
}

// ===============================
//   GUARDAR PREGUNTA
// ===============================

async function guardarPregunta() {
    const enunciado = document.getElementById("enunciadoPregunta").value.trim();
    const opcionesTexto = document.querySelectorAll(".opcion-texto");
    const opcionCorrecta = document.querySelector("input[name='opcionCorrecta']:checked");

    if (!enunciado) {
        alert("Debes ingresar el enunciado");
        return;
    }

    if (opcionesTexto.length < 2) {
        alert("Debe haber al menos dos opciones");
        return;
    }

    if (!opcionCorrecta) {
        alert("Selecciona la opción correcta");
        return;
    }

    try {
        // =========================
        // 1. CREAR PREGUNTA
        // =========================
        const preguntaRes = await fetch(API_PREGUNTA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                enunciado: enunciado,
                idEjercicio: idEjercicio
            })
        });

        if (!preguntaRes.ok) throw new Error("Error al crear pregunta");

        const pregunta = await preguntaRes.json();
        preguntaActualId = pregunta.id;

        // =========================
        // 2. CREAR OPCIONES
        // =========================
        const opcionesPromises = [];

        opcionesTexto.forEach((input, index) => {
            const texto = input.value.trim();
            if (!texto) return;

            const correcta = opcionCorrecta.value == (index + 1);

            opcionesPromises.push(
                fetch(API_OPCION, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        texto: texto,
                        correcta: correcta,
                        idPregunta: preguntaActualId
                    })
                })
            );
        });

        await Promise.all(opcionesPromises);

        alert("Pregunta creada correctamente");
        limpiarFormularioPregunta();

    } catch (error) {
        console.error(error);
        alert("Error al guardar la pregunta");
    }
}

// ===============================
//   NUEVA PREGUNTA
// ===============================

function nuevaPregunta() {
    limpiarFormularioPregunta();
}

// ===============================
//   LIMPIAR FORM
// ===============================

function limpiarFormularioPregunta() {
    document.getElementById("enunciadoPregunta").value = "";
    document.getElementById("opcionesContainer").innerHTML = "";
    contadorOpciones = 0;
    preguntaActualId = null;

    agregarOpcion();
    agregarOpcion();
}

// ===============================
//   NAVEGACIÓN
// ===============================

function volverATeoria() {
    window.location.href = "teoria.html";
}
