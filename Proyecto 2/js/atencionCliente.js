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
        } else if (item.id === 'recargar-btn') {
            if (!localStorage.getItem('tarjetaRegistrada')) {
                window.location.href = 'agregarTarjeta.html';
                return;
            }
            window.location.href = 'recargaTarjeta.html'; 
        } else if (item.id === 'bloqueo-btn') {
            window.location.href = 'bloqueoTarjeta.html';
        } else if (item.id === 'atencion-btn') {
            window.location.href = 'atencionCliente.html';
        }
    });
});

// Redirección para "Registrarse" y "Perfil"
document.querySelector('[aria-label="Perfil"]').addEventListener('click', () => {
    window.location.href = 'perfil.html';
});

// Manejo del formulario y notificación
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const notification = document.getElementById("notification");

    // MOSTRAR NOMBRE DEL USUARIO SI ESTÁ GUARDADO
    const nombre = localStorage.getItem('nombreUsuario');
    const userNameElement = document.getElementById('user-name');
    
    if (nombre && userNameElement) {
        userNameElement.textContent = nombre;
        userNameElement.onclick = () => window.location.href = 'perfil.html';
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar envío real del formulario
        
        // Mostrar la notificación
        notification.classList.add("show");

        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);

        // Opcional: Limpiar el formulario después de enviar
        contactForm.reset();
    });
});
