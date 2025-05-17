// Manejo del botón para mostrar/ocultar el menú
const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('#menu-items');
const sidebar = document.querySelector('.sidebar');

// Alternar entre mostrar u ocultar el menú
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
});

// Manejo de clics en los elementos del menú lateral
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.id === 'inicio-btn') {
            window.location.href = 'freemium.html'; 
        } else if (item.id === 'atencion-btn') {
            window.location.href = 'atencionCliente.html'; 
        }
    });
});

function hashPassword(password) {
    const fixedSalt = 'M0v¡ç@rD!6%KJABSUIUHGd%$%$·;:ka46851615^`';
    const combined = password + fixedSalt;
    const hash = CryptoJS.SHA512(combined);

    // 👉 LOG para debug
    console.log("🔐 Contraseña original:", password);
    console.log("🔒 Contraseña hasheada:", hash.toString(CryptoJS.enc.Hex));
    alert("🔒 Hash generado: " + hashedResult);

    return hash.toString(CryptoJS.enc.Hex);
}

const clienteId = localStorage.getItem("clienteId");

if (!clienteId) {
    alert("No se ha encontrado el ID del cliente. Redirigiendo al login.");
    window.location.href = "login.html";
} else {
    document.addEventListener("DOMContentLoaded", () => {
        const nombreGuardado = localStorage.getItem('nombreUsuario');
        if (nombreGuardado) {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) userNameElement.textContent = nombreGuardado;
        }

        fetch(`http://34.224.233.49:8000/api/clientes/${clienteId}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('nombreUsuario', data.nombre || 'Usuario');
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
            });

        document.querySelector('.personal-info-form').addEventListener('submit', async function(event) {
            event.preventDefault();

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

            const currentPasswordInput = document.getElementById('current-password').value;
            const newPasswordInput = document.getElementById('new-password').value;
            const confirmPasswordInput = document.getElementById('confirm-password').value;

            let newPasswordHashed = "";

            if (currentPasswordInput || newPasswordInput || confirmPasswordInput) {
                if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
                    alert("Completa todos los campos de contraseña si deseas cambiarla.");
                    return;
                }

                if (newPasswordInput !== confirmPasswordInput) {
                    alert("La nueva contraseña y su confirmación no coinciden.");
                    return;
                }

                try {
                    const response = await fetch(`http://34.224.233.49:8000/api/clientes/${clienteId}`);
                    const cliente = await response.json();
                    const hashedActual = hashPassword(currentPasswordInput);
                    if (hashedActual !== cliente.password) {
                        alert("La contraseña actual no es correcta.");
                        return;
                    }
                    newPasswordHashed = hashPassword(newPasswordInput);
                } catch (error) {
                    alert("Error al validar la contraseña actual.");
                    return;
                }
            }

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
                password: newPasswordHashed || undefined
            };

            const guardarButton = document.querySelector('button[type="submit"]');
            guardarButton.disabled = true;
            guardarButton.textContent = "Guardando...";

            fetch(`http://34.224.233.49:8000/api/clientes/${clienteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(datosActualizados),
            })
            .then(res => res.json())
            .then(data => {
                alert("Datos actualizados correctamente.");
                document.getElementById('user-name').textContent = data.nombre || 'Usuario';
                localStorage.setItem('nombreUsuario', data.nombre || 'Usuario');
            })
            .catch(err => {
                console.error("Error al actualizar:", err);
                alert("Hubo un problema al guardar los datos.");
            })
            .finally(() => {
                guardarButton.disabled = false;
                guardarButton.textContent = "Guardar";
            });
        });
    });
}
