let idUsr = localStorage.getItem("idUsuario");
const API_URL = `http://localhost:8080/smartlearn/api/usuario/${idUsr}`;

document.addEventListener("DOMContentLoaded", () => {
    if(!idUsr){
        alert("Ocurrió un problema");
        window.history.back;
    }

    cargarUsuario();
})

async function cargarUsuario() {
    if (!idUsr) {
        console.error("ID de usuario no disponible");
        window.history.back;
        return;
    }


    try{
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status == 404){
            alert("Usuario no encontrado");
            window.location.href = 'smartLearn.html';
            return;
        }

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.nombreCuenta || !data.correo) {
            throw new Error("Datos de usuario incompletos");
        }
        
        document.getElementById("nombreLabel").textContent = data.nombreCuenta;
        document.getElementById("correoLabel").textContent = data.correo;

        console.info("Usuario cargado correctamente");

    } catch(error){
        console.error("Error al cargar usuario", error);
        alert("Ocurrió un error al cargar el usuario");
    }
}

let accionPendiente = null;

/* ==============================
   CONTROL DE SECCIONES
================================ */

function ocultarSecciones() {
    document.querySelectorAll("section.card").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById("usuarioTarget").classList.remove("hidden");
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.remove("hidden");
}

/* ==============================
   FLUJO DE AUTENTICACIÓN
================================ */

function solicitarAutenticacion(accion) {
    accionPendiente = accion;
    ocultarSecciones();
    document.getElementById("verificarPasswordSection").classList.remove("hidden");
}

function cancelarAccion() {
    accionPendiente = null;
    ocultarSecciones();
}

/* ==============================
   VERIFICAR CONTRASEÑA
================================ */

document.getElementById("verificarPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("passwordConfirmacion").value;

    if (!password) {
        alert("Debes ingresar tu contraseña");
        return;
    }

    const response = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            passwordActual: password,
            passwordNueva: password
        })
    });

    if (response.status === 401) {
        alert("Contraseña incorrecta");
        return;
    }

    if (!response.ok && response.status !== 204) {
        alert("Error de verificación");
        return;
    }

    // Contraseña válida
    switch (accionPendiente) {
        case "password":
            mostrarSeccion("cambiarPasswordSection");
            break;
        case "editar":
            precargarFormularioEdicion(password);
            mostrarSeccion("editarUsuarioSection");
            break;
        case "eliminar":
            mostrarSeccion("eliminarCuentaSection");
            break;
    }
});

/* ==============================
   CAMBIAR CONTRASEÑA
================================ */

document.getElementById("cambiarPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nueva = document.getElementById("nuevaPassword").value;
    const confirmar = document.getElementById("confirmarPassword").value;

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const passwordActual = document.getElementById("passwordConfirmacion").value;

    const response = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            passwordActual,
            passwordNueva: nueva
        })
    });

    if (response.status === 204) {
        alert("Contraseña actualizada correctamente");
        location.reload();
    } else if (response.status === 401) {
        alert("Contraseña actual incorrecta");
    } else {
        alert("Error al actualizar contraseña");
    }
});

/* ==============================
   EDITAR USUARIO
================================ */

function precargarFormularioEdicion(contrasena) {
    document.getElementById("editarNombre").value =
        document.getElementById("nombreLabel").textContent;

    document.getElementById("editarCorreo").value =
        document.getElementById("correoLabel").textContent;
    
    document.getElementById("editarContrasena").value = contrasena;
}

document.getElementById("editarUsuarioForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("editarNombre").value;
    const correo = document.getElementById("editarCorreo").value;
    const password = document.getElementById("editarContrasena").value;

    const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombreCuenta: nombre,
            correo: correo,
            contrasena: password,
            idRol: 3
        })
    });

    if (response.ok) {
        alert("Perfil actualizado correctamente");
        cargarUsuario();
        ocultarSecciones();
    } else {
        alert("Error al actualizar perfil");
    }
});

/* ==============================
   ELIMINAR CUENTA
================================ */

async function confirmarEliminacion() {
    const confirmacion = confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.");

    if (!confirmacion) return;

    const response = await fetch(API_URL, {
        method: "DELETE"
    });

    if (response.status === 204) {
        alert("Cuenta eliminada correctamente");
        logout();
    } else {
        alert("Error al eliminar la cuenta");
    }
}
