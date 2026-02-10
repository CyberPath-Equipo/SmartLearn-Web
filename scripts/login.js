document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        const loginData = {
            correo: correo,
            contrasena: password
        };

        try {
            const response = await fetch("http://localhost:8080/smartlearn/api/usuario/login/docente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                alert("Usuario o contraseña incorrectas");
                return;
            }

            const data = await response.json();

            // Guardar token y datos del usuario
            localStorage.setItem("token", data.token);
            localStorage.setItem("idUsuario", data.idUsuario);
            localStorage.setItem("nombreCuenta", data.nombreCuenta);
            localStorage.setItem("idRol", data.idRol);

            console.log("Inicio de sesión correcto:", data);

            window.location.href = "materias.html";

        } catch (error) {
            console.error("Error en login:", error);
            alert("Error de conexión con el servidor");
        }
    });
});