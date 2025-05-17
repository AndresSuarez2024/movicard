// Función para hacer hash SHA-512 en navegador con salt fijo
function hashPassword(password) {
    const fixedSalt = 'M0v¡ç@rD!6%KJABSUIUHGd%$%$·;:ka46851615^`';
    const combined = password + fixedSalt;
    const hash = CryptoJS.SHA512(combined);
    return hash.toString(CryptoJS.enc.Hex);
}

// Escuchar el submit del formulario
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    if (!email || !passwordInput) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    const password = await hashPassword(passwordInput);

    // Limpiar localStorage
    localStorage.clear();

    fetch('http://34.224.233.49:8000/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, password: password })
    })
    .then(response => response.json())
    .then(async data => {
        if (data.message === 'Login exitoso') {
            const cliente = data.cliente;
            localStorage.setItem('nombreUsuario', cliente.nombre);
            localStorage.setItem('suscripcionUsuario', cliente.suscripcion);
            localStorage.setItem('clienteId', cliente.id);
            localStorage.setItem('usuarioIniciado', 'true');

            const clienteId = cliente.id;

            // Paso 1: Consultar si ya tiene tarjeta
            const tarjetaResponse = await fetch(`http://34.224.233.49:8000/api/tarjetas/cliente/${clienteId}`);
            const tarjetaData = await tarjetaResponse.json();

            if (tarjetaData && tarjetaData.id) {
                localStorage.setItem('tarjetaId', tarjetaData.id);
                console.log("✅ Tarjeta ya existente asignada:", tarjetaData.id);
            } else {
                // Paso 2: Crear tarjeta si no existe
                const idSuscripcion = cliente.id_suscripcion || 1; // Ajusta según tu estructura de datos
                const crearResponse = await fetch(`http://34.224.233.49:8000/post/tarjeta/?id_cliente=${clienteId}&id_suscripcion=${idSuscripcion}`, {
                    method: "POST"
                });

                const crearData = await crearResponse.json();

                if (crearResponse.ok && crearData.UUID) {
                    console.log("✅ Tarjeta creada:", crearData.UUID);
                    // Reconsultar para obtener la tarjeta completa
                    const nuevaTarjeta = await fetch(`http://34.224.233.49:8000/api/tarjetas/cliente/${clienteId}`);
                    const tarjetaFinal = await nuevaTarjeta.json();

                    localStorage.setItem("tarjetaId", tarjetaFinal.id); 
                } else {
                    console.warn("⚠️ No se pudo crear la tarjeta:", crearData.detail || crearData);
                }
            }

            // Redirigir según tipo de suscripción
            if (cliente.suscripcion === 'PREMIUM') {
                window.location.href = "premium.html";
            } else {
                window.location.href = "freemium.html";
            }

        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(error => {
        console.error('Error al hacer login:', error);
        alert("Hubo un error al intentar iniciar sesión.");
    });
});
