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
        } else if (item.id === 'consultar-btn') {
            window.location.href = 'picadasFreemium.html'; 
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

let saldo = 0;

// Función para seleccionar el monto de recarga (5€, 10€, 20€)
function seleccionarMonto(monto) {
  document.getElementById('monto-personalizado').value = monto;
}

// Función para confirmar la recarga
function confirmarRecarga() {
  // Verificar si el cliente está logueado y tiene un `cliente_id`
  const clienteId = localStorage.getItem('clienteId');

  if (!clienteId) {
    mostrarMensaje("Debes iniciar sesión para poder recargar.", "error");
    return;
  }

  // Verificar si la tarjeta está registrada antes de proceder
  if (!localStorage.getItem('tarjetaRegistrada')) {
    mostrarMensaje("Debes registrar tu tarjeta antes de poder recargar.", "error");
    return;
  }

  const monto = parseFloat(document.getElementById('monto-personalizado').value);

  if (isNaN(monto) || monto <= 0) {
    mostrarMensaje("Por favor, introduce un monto válido.", "error");
    return;
  }

  saldo += monto;
  actualizarSaldo();

  mostrarMensaje(`Recarga de ${monto}€ realizada con éxito.`, "success");

  // Redirigir a la página de pago (ingresarTarjeta.html) con el cliente_id
  window.location.href = 'ingresarTarjeta.html';
}

// Función para actualizar el saldo en la página
function actualizarSaldo() {
  document.getElementById('saldo-actual').textContent = `${saldo}€`;
  document.getElementById('saldo-tarjeta').textContent = `${saldo}€`;
}

// Función para mostrar mensajes de éxito o error
function mostrarMensaje(texto, tipo) {
  const mensajeDiv = document.getElementById('mensaje');
  mensajeDiv.textContent = texto;

  if (tipo === "success") {
    mensajeDiv.style.color = "#27ae60"; // Verde para éxito
  } else {
    mensajeDiv.style.color = "#e74c3c"; // Rojo para error
  }
}

// 🚀 Funcionalidad añadida: Redirección a la página de pago
function redirigirAPago() {
    const clienteId = localStorage.getItem('clienteId');

    if (!clienteId) {
        mostrarMensaje("Debes iniciar sesión para proceder con el pago.", "error");
        return;
    }

    window.location.href = 'ingresarTarjeta.html';
}

// Asigna eventos a los botones de selección de recarga
document.querySelectorAll('.select-button').forEach(button => {
    button.addEventListener('click', function () {
        redirigirAPago();
    });
});
