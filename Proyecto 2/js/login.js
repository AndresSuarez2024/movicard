// Función para hacer hash SHA-512 en navegador con salt fijo
function hashPassword(password) {
    const fixedSalt = 'M0v¡ç@rD!6%KJABSUIUHGd%$%$·;:ka46851615^`';
    const combined = password + fixedSalt;
    const hash = CryptoJS.SHA512(combined);
    return hash.toString(CryptoJS.enc.Hex);
}

// Escuchar el submit del formulario
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar envío del formulario

    const email = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    if (!email || !passwordInput) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    // Hashear la contraseña
    const password = await hashPassword(passwordInput);

    // Limpiar localStorage antes de login
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('suscripcionUsuario');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('tarjetaId');

    // Enviar solicitud a API
    fetch('http://34.224.233.49:8000/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login exitoso') {
            localStorage.setItem('nombreUsuario', data.cliente.nombre);
            localStorage.setItem('suscripcionUsuario', data.cliente.suscripcion);
            localStorage.setItem('clienteId', data.cliente.id);
            localStorage.setItem('usuarioIniciado', 'true');

            const clienteId = data.cliente.id;

            // Nueva petición para obtener la tarjeta del cliente
            fetch(`http://34.224.233.49:8000/api/tarjetas/cliente/${clienteId}`)
                .then(res => res.json())
                .then(tarjeta => {
                    if (tarjeta.id) {
                        localStorage.setItem('tarjetaId', tarjeta.id);
                    } else {
                        console.warn("No se pudo obtener la tarjeta del cliente.");
                    }

                    // Redirigir según la suscripción
                    const suscripcion = data.cliente.suscripcion;
                    if (suscripcion === 'PREMIUM') {
                        window.location.href = "premium.html";
                    } else {
                        window.location.href = "freemium.html";
                    }
                })
                .catch(err => {
                    console.error("Error al obtener la tarjeta del cliente:", err);
                    alert("Error al obtener la tarjeta del cliente.");
                });

        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error('Error al hacer login:', error);
        alert("Hubo un error al intentar iniciar sesión.");
    });
});
