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
            window.location.href = 'inicio.html'; 
        } else if (item.id === 'atencion-btn') {
            window.location.href = 'atencionCliente.html'; 
        }
    });
});

// Redirección para "Registrarse" y "Perfil"
document.querySelector('[aria-label="Registrarse"]').addEventListener('click', () => {
    window.location.href = 'registro.html';
});

document.querySelector('[aria-label="Perfil"]').addEventListener('click', () => {
    window.location.href = 'login.html';
});

// ----------- BLOQUEO DE ACCESO A SECCIONES PROTEGIDAS -----------

// Verifica si el usuario está autenticado
function usuarioAutenticado() {
    return localStorage.getItem('usuarioIniciado') === 'true';
}

// Acceso condicional a Gestiones
const btnGestiones = document.querySelector('#btn-gestiones');
if (btnGestiones) {
    btnGestiones.addEventListener('click', (e) => {
        e.preventDefault();
        if (usuarioAutenticado()) {
            window.location.href = 'gestionesPremium.html';
        } else {
            alert('Debes iniciar sesión para acceder a Gestiones.');
        }
    });
}

// Acceso condicional a Estadísticas
const btnEstadisticas = document.querySelector('#btn-estadisticas');
if (btnEstadisticas) {
    btnEstadisticas.addEventListener('click', (e) => {
        e.preventDefault();
        if (usuarioAutenticado()) {
            window.location.href = 'estadisticas.html';
        } else {
            alert('Debes iniciar sesión para acceder a Estadísticas.');
        }
    });
}

// ----------- CONTROL VISUAL DE BOTONES DE SESIÓN -----------

window.addEventListener('DOMContentLoaded', () => {
    const registrarseBtn = document.querySelector('[aria-label="Registrarse"]');
    const perfilBtn = document.querySelector('[aria-label="Perfil"]');
    const logoutBtn = document.querySelector('.logout-button');

    if (usuarioAutenticado()) {
        if (registrarseBtn) registrarseBtn.style.display = 'none';
        if (perfilBtn) perfilBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});

// ----------- CIERRE DE SESIÓN -----------
function cerrarSesion() {
    localStorage.removeItem('usuarioIniciado');
    window.location.href = 'inicio.html';
}
