// Obtener el clienteId desde localStorage
const clienteId = localStorage.getItem("clienteId");

if (!clienteId) {
    alert("No se ha encontrado el ID del cliente. Redirigiendo al login.");
    window.location.href = "login.html"; // Si no hay clienteId, redirige al login
} else {
    document.addEventListener("DOMContentLoaded", () => {
        // Mostrar el nombre guardado en localStorage antes de la carga
        const nombreGuardado = localStorage.getItem('nombreUsuario');
        if (nombreGuardado) {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = nombreGuardado;
            }
        }

        // Cargar datos del cliente
        fetch(`http://34.224.233.49:8000/api/clientes/${clienteId}`)
            .then(res => res.json())
            .then(data => {
                // Guardar nombre en localStorage
                localStorage.setItem('nombreUsuario', data.nombre || 'Usuario');

                // Llenar campos del formulario
                document.getElementById('document-type').value = "dni";
                document.getElementById('document-number').value = data.dni || '';
                document.getElementById('name').value = data.nombre || '';
                document.getElementById('first-surname').value = data.apellido?.split(" ")[0] || '';
                document.getElementById('province').value = data.ciudad || '';
                document.getElementById('phone').value = data.telefono || '';
                document.getElementById('email').value = data.correo || '';
                document.getElementById('address').value = data.direccion || '';
                document.getElementById('block-number').value = data.numero_bloque || '';
                document.getElementById('floor-number').value = data.numero_piso || '';
                document.getElementById('postal-code').value = data.codigopostal || '';
                document.getElementById('city').value = data.ciudad || '';

                // Mostrar contraseña como asteriscos
                const passwordField = document.getElementById('password');
                passwordField.value = '*'.repeat(data.password?.length || 0);

                // Mostrar nombre en el encabezado
                document.getElementById('user-name').textContent = data.nombre || 'Usuario';
            })
            .catch(err => {
                console.error("Error al cargar los datos:", err);
                alert("No se pudieron cargar los datos del cliente.");
            });

        // Menu lateral
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.id === 'inicio-btn') {
                    window.location.href = 'freemium.html';
                } else if (item.id === 'recargar-btn') {
                    window.location.href = 'recargaFreemium.html';
                } else if (item.id === 'bloqueo-btn') {
                    window.location.href = 'bloqueoTarjeta.html';
                } else if (item.id === 'atencion-btn') {
                    window.location.href = 'atencionCliente.html';
                }
            });
        });
    });

    // Alternar visibilidad de la contraseña
    document.getElementById('toggle-password').addEventListener('click', () => {
        const passwordField = document.getElementById('password');
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        document.getElementById('toggle-password').textContent = isPassword ? '👁️‍🗨️' : '👁️';
    });

    // Guardar cambios al hacer submit
    document.querySelector('.personal-info-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener valores del formulario
        const documentType = document.getElementById('document-type').value;
        const documentNumber = document.getElementById('document-number').value;
        const name = document.getElementById('name').value;
        const firstSurname = document.getElementById('first-surname').value;
        const province = document.getElementById('province').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const blockNumber = document.getElementById('block-number').value;
        const floorNumber = document.getElementById('floor-number').value;
        const postalCode = document.getElementById('postal-code').value;
        const city = document.getElementById('city').value;
        const password = document.getElementById('password').value;

        // Crear objeto de datos actualizados
        const datosActualizados = {
            dni: documentNumber,
            nombre: name,
            apellido: `${firstSurname}`.trim(),
            correo: email,
            telefono: phone,
            direccion: address,
            numero_bloque: blockNumber,
            numero_piso: floorNumber,
            codigopostal: postalCode,
            ciudad: city,
            password: password || "", // Vacío si no se cambia
        };

        // Mostrar botón de carga
        const guardarButton = document.querySelector('button[type="submit"]');
        guardarButton.disabled = true;
        guardarButton.textContent = "Guardando...";

        // Hacer solicitud PUT
        fetch(`http://34.224.233.49:8000/api/clientes/${clienteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(datosActualizados),
        })
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            return res.json();
        })
        .then(data => {
            alert("Datos actualizados correctamente.");

            // Actualizar encabezado y guardar nombre en localStorage
            document.getElementById('user-name').textContent = data.nombre || 'Usuario';
            localStorage.setItem('nombreUsuario', data.nombre || 'Usuario');

            guardarButton.disabled = false;
            guardarButton.textContent = "Guardar";
        })
        .catch(err => {
            console.error("Error al actualizar:", err);
            alert("Hubo un problema al guardar los datos.");
            guardarButton.disabled = false;
            guardarButton.textContent = "Guardar";
        });
    });
}
