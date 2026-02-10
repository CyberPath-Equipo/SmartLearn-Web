const API_EJERCICIO = "http://localhost:8080/smartlearn/api/ejercicio";

const idTeoria = localStorage.getItem("idTeoria");

if (!idTeoria) {
    alert("No se encontró la teoría asociada");
    window.history.back();
}

// ===============================
//  FORMULARIO
// ===============================

const ejercicioForm = document.getElementById("ejercicioForm");

ejercicioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreEjercicio").value.trim();

    if (!nombre) {
        alert("El nombre del ejercicio es obligatorio");
        return;
    }

    const nuevoEjercicio = {
        nombre: nombre,
        idSubtema: idTeoria
    };

    try {
        const response = await fetch(API_EJERCICIO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoEjercicio)
        });

        if (!response.ok) {
            throw new Error("Error al crear el ejercicio");
        }

        const ejercicioCreado = await response.json();

        // Guardamos el ID del ejercicio para la siguiente pantalla
        localStorage.setItem("idEjercicio", ejercicioCreado.id);
        localStorage.setItem("nombreEjercicio", ejercicioCreado.nombre);

        alert("Ejercicio creado con éxito")
        // Redirigir a crear preguntas
        window.location.href = "crear-preguntas.html";

    } catch (error) {
        console.error(error);
        alert("No se pudo crear el ejercicio");
    }
});

// ===============================
//  NAVEGACIÓN
// ===============================

function volverATeoria() {
    window.location.href = "teoria.html";
}