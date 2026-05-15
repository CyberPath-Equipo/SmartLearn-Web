/* =========================
   VARIABLES GLOBALES
========================= */
const API_BASE = "http://localhost:8080/smartlearn/api";
let ejercicioActual = null;
const idTeoria = localStorage.getItem("idTeoria");

document.addEventListener("DOMContentLoaded", () => {
    verificarEjercicio();
    document.getElementById("crearEjercicioForm")
        .addEventListener("submit", crearEjercicio);
    document.getElementById("editarEjercicioForm")
        .addEventListener("submit", guardarEdicion);
});

/* =========================
   VISIBILIDAD SECCIONES
========================= */
function ocultarTodo() {
    document.querySelectorAll("section.card")
        .forEach(s => s.classList.add("hidden"));
}

function mostrar(id) {
    ocultarTodo();
    document.getElementById(id).classList.remove("hidden");
}

/* =========================
   VERIFICAR EJERCICIO
========================= */
async function verificarEjercicio() {
    try {
        const res = await fetch(`${API_BASE}/subtema/${idTeoria}/ejercicios`); // TO-DO: Arreglar el editar.js para que quede en base a la nueva arquitectura
        if (res.ok) {
            ejercicioActual = await res.json();
            mostrar("ejercicioExistenteSection");
        } else {
            mostrar("crearEjercicioSection");
        }
    } catch (e) {
        console.error("Error al verificar ejercicio", e);
    }
}

/* =========================
   CREAR EJERCICIO
========================= */
async function crearEjercicio(e) {
    e.preventDefault();

    const data = construirDTO(
        document.getElementById("enunciadoPregunta").value,
        document.querySelectorAll("#opcionesContainer .opcion-item")
    );

    try {
        const res = await fetch(`${API_BASE}/ejercicios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teoriaId: idTeoria,
                ...data
            })
        });

        if (res.ok) location.reload();
        else alert("Error al crear ejercicio");

    } catch (e) {
        console.error(e);
    }
}

/* =========================
   CONSULTAR EJERCICIO
========================= */
function consultarEjercicio() {
    mostrar("consultarEjercicioSection");

    document.getElementById("preguntaTexto").textContent =
        ejercicioActual.pregunta;

    const lista = document.getElementById("listaOpciones");
    lista.innerHTML = "";

    ejercicioActual.opciones.forEach(op => {
        const li = document.createElement("li");
        li.className = "opcion";
        li.innerHTML = `
            <span>${op.texto}</span>
            ${op.correcta ? `<span class="badge-correcta">Correcta</span>` : ""}
        `;
        lista.appendChild(li);
    });
}

/* =========================
   EDITAR EJERCICIO
========================= */
function editarEjercicio() {
    mostrar("editarEjercicioSection");

    document.getElementById("editarPregunta").value =
        ejercicioActual.pregunta;

    const cont = document.getElementById("editarOpcionesContainer");
    cont.innerHTML = "";

    ejercicioActual.opciones.forEach(op => {
        cont.appendChild(crearOpcionEditar(op));
    });
}

async function guardarEdicion(e) {
    e.preventDefault();

    const data = construirDTO(
        document.getElementById("editarPregunta").value,
        document.querySelectorAll("#editarOpcionesContainer .opcion-item")
    );

    try {
        const res = await fetch(`${API_BASE}/ejercicios/${ejercicioActual.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) location.reload();
        else alert("Error al guardar cambios");

    } catch (e) {
        console.error(e);
    }
}

/* =========================
   ELIMINAR EJERCICIO
========================= */
async function eliminarEjercicio() {
    if (!confirm("¿Eliminar este ejercicio?")) return;

    try {
        const res = await fetch(
            `${API_BASE}/ejercicios/${ejercicioActual.id}`,
            { method: "DELETE" }
        );

        if (res.ok) location.reload();
        else alert("Error al eliminar");

    } catch (e) {
        console.error(e);
    }
}

/* =========================
   OPCIONES
========================= */
function agregarOpcion() {
    document.getElementById("opcionesContainer")
        .appendChild(crearOpcionEditar());
}

function agregarOpcionEditar() {
    document.getElementById("editarOpcionesContainer")
        .appendChild(crearOpcionEditar());
}

function crearOpcionEditar(op = {}) {
    const div = document.createElement("div");
    div.className = "opcion-item";

    div.innerHTML = `
        <input type="text" class="opcion-texto"
               value="${op.texto || ""}" required>

        <label class="checkbox-label">
            <input type="checkbox" class="opcion-correcta"
                   ${op.correcta ? "checked" : ""}>
            Correcta
        </label>

        <button type="button" class="btn-ghost"
                onclick="this.parentElement.remove()">✕</button>
    `;

    if (op.id) div.dataset.id = op.id;
    return div;
}

/* =========================
   DTO BUILDER
========================= */
function construirDTO(pregunta, nodosOpciones) {
    return {
        pregunta: pregunta.trim(),
        opciones: Array.from(nodosOpciones).map(o => ({
            id: o.dataset.id || null,
            texto: o.querySelector(".opcion-texto").value.trim(),
            correcta: o.querySelector(".opcion-correcta").checked
        }))
    };
}

/* =========================
   CANCELAR
========================= */
function mostrarOpcionesEjercicio() {
    mostrar("ejercicioExistenteSection");
}
