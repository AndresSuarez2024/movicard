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
        } else if (item.id === 'consultar-btn') {
            window.location.href = 'picadasPremium.html'; 
        } else if (item.id === 'recargar-btn') {
            window.location.href = 'recargaPremium.html';
        } else if (item.id === 'bloqueo-btn') {
            window.location.href = 'bloqueoTarjeta.html';
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

const movimientos = [
  { fecha: "10/04/2025", descripcion: "Recarga tarjeta", monto: "48.40€" },
  { fecha: "30/01/2025", descripcion: "Recarga tarjeta", monto: "48.40€" },
  { fecha: "08/07/2024", descripcion: "Recarga tarjeta", monto: "48.40€" },
  { fecha: "07/04/2024", descripcion: "Recarga tarjeta", monto: "48.40€" },
  { fecha: "01/01/2024", descripcion: "Recarga tarjeta", monto: "48.40€" },
];

function cargarMovimientos() {
  const tbody = document.getElementById("movimientos-body");
  tbody.innerHTML = "";

  movimientos.forEach(movimiento => {
    agregarFilaMovimiento(movimiento);
  });
}

function filtrarMovimientos() {
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  
  if (!fechaInicio || !fechaFin) {
    alert("Por favor, selecciona ambas fechas.");
    return;
  }

  const tbody = document.getElementById("movimientos-body");
  tbody.innerHTML = "";

  const movimientosFiltrados = movimientos.filter(mov => 
    mov.fecha >= fechaInicio && mov.fecha <= fechaFin
  );

  if (movimientosFiltrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3'>No hay movimientos en el rango seleccionado.</td></tr>";
  } else {
    movimientosFiltrados.forEach(agregarFilaMovimiento);
  }
}

function agregarFilaMovimiento(movimiento) {
  const tbody = document.getElementById("movimientos-body");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${movimiento.fecha}</td>
    <td>${movimiento.descripcion}</td>
    <td>${movimiento.monto}</td>
  `;

  tbody.appendChild(fila);
}

// Cargar movimientos al inicio
window.onload = cargarMovimientos;
