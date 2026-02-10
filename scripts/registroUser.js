document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const password = document.getElementById("contrasena").value;

        const loginData = {
            nombreCuenta: nombre,
            correo: correo,
            contrasena: password,
            idRol: 3   // Docente
        };

        try {
            const response = await fetch("http://localhost:8080/smartlearn/api/usuario/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                alert("Error al registrar usuario");
                return;
            }

            const data = await response.json();

            console.log("Usuario registrado:", data);

            // Guarda al usuario en local storage
            localStorage.setItem("usuario", data.nombreCuenta);

            window.location.href = "login.html";

        } catch (error) {
            console.error("Error en registro:", error);
            alert("Error de conexión con el servidor");
        }
    });

});