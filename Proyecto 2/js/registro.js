document.addEventListener("DOMContentLoaded", () => {
    const togglePasswords = document.querySelectorAll(".toggle-password");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm");
    const form = document.getElementById("registerForm");

    // Mostrar/Ocultar contraseñas
    togglePasswords.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === "password" ? "text" : "password";
        });
    });

    // Función para hacer hash SHA-512 con salt fijo (en navegador)
    function hashPassword(password) {
    const fixedSalt = 'M0v¡ç@rD!6%KJABSUIUHGd%$%$·;:ka46851615^`';
    const combined = password + fixedSalt;
    const hash = CryptoJS.SHA512(combined);
    return hash.toString(CryptoJS.enc.Hex);
}
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!document.getElementById("terms").checked) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        if (passwordInput.value !== confirmInput.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const hashedPassword = await hashPassword(passwordInput.value);

        const data = {
            nombre: document.getElementById("name").value,
            apellido: document.getElementById("surname").value,
            dni: document.getElementById("dni").value,
            correo: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            direccion: document.getElementById("direccion").value,
            numero_bloque: document.getElementById("numero_bloque").value,
            numero_piso: document.getElementById("numero_piso").value,
            codigopostal: document.getElementById("codigopostal").value,
            ciudad: document.getElementById("ciudad").value,
            password: hashedPassword
        };

        try {
            const response = await fetch("http://34.224.233.49:8000/api/clientes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Cuenta creada con éxito.");
                const usuarioId = result.id;

                // Crear suscripción gratuita
                const subscriptionData = {
                    suscripcion: 'GRATUITA',
                    id_cliente: usuarioId
                };

                const suscripcionResponse = await fetch("http://34.224.233.49:8000/api/suscripciones/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(subscriptionData)
                });

                const suscripcionResult = await suscripcionResponse.json();

                if (suscripcionResponse.ok) {
                    console.log("Suscripción 'GRATUITA' creada con éxito.");
                } else {
                    console.error("Error al crear la suscripción:", suscripcionResult.detail);
                }

                form.reset();
                window.location.href = "login.html";
            } else {
                alert(`Error: ${result.detail}`);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            console.error(error);
        }
    });
});
