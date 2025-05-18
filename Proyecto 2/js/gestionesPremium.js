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
            window.location.href = 'premium.html'; 
        } else if (item.id === 'atencion-btn') {
            window.location.href = 'atencionCliente.html'; 
        }
    });
});

// Mostrar el nombre del usuario si está guardado
document.addEventListener('DOMContentLoaded', () => {
    const nombre = localStorage.getItem('nombreUsuario');
    const userNameElement = document.getElementById('user-name');

    if (nombre && userNameElement) {
        userNameElement.textContent = nombre;
        userNameElement.onclick = () => window.location.href = 'perfil.html';
    }
});
