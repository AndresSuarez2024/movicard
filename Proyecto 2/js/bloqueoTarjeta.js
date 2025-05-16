document.addEventListener('DOMContentLoaded', () => {
  const nombre = localStorage.getItem('nombreUsuario');
  const userNameElement = document.getElementById('user-name');
  const idCliente = localStorage.getItem("clienteId");
  const tarjetaId = localStorage.getItem("tarjetaId");

  if (nombre && userNameElement) {
    userNameElement.textContent = nombre;
    userNameElement.onclick = () => window.location.href = 'perfil.html';
  }

  if (!idCliente || !tarjetaId) {
    alert("No se encontró el ID del cliente o de la tarjeta.");
    return;
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
  });

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const routes = {
        'inicio-btn': 'premium.html',
        'picadas-btn': 'picadasPremium.html',
        'recargar-btn': 'recargaPremium.html',
        'historial-btn': 'historialMovimiento.html',
        'atencion-btn': 'atencionCliente.html'
      };
      if (routes[item.id]) {
        window.location.href = routes[item.id];
      }
    });
  });

  const estadoTarjetaElement = document.getElementById("estadoTarjeta");
  const tarjetaElement = document.getElementById("tarjeta");
  const btnBloquear = document.getElementById("btnBloquear");
  const btnDesbloquear = document.getElementById("btnDesbloquear");
  const uuidElement = document.getElementById("uuidTarjeta");

  // --- OBTENER DATOS DE LA TARJETA ---
  async function obtenerEstadoTarjeta() {
    try {
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/${tarjetaId}`);
      if (!response.ok) throw new Error("Error al obtener la tarjeta.");
      const data = await response.json();

      const estado = data.estadotarjeta; // Usas "estadotarjeta" según tu GET
      const uuid = data.UUID; // Usas "UUID" según tu GET

      // Mostrar UUID
      if (uuidElement && uuid) {
        uuidElement.textContent = uuid || "UUID no disponible";
      }

      if (estado === "ACTIVADA") {
        estadoTarjetaElement.textContent = "Tarjeta activa";
        tarjetaElement.classList.add("tarjeta-activa");
        tarjetaElement.classList.remove("tarjeta-bloqueada");
        btnBloquear.disabled = false;
        btnDesbloquear.disabled = true;
      } else if (estado === "BLOQUEADA") {
        estadoTarjetaElement.textContent = "Tarjeta bloqueada";
        tarjetaElement.classList.add("tarjeta-bloqueada");
        tarjetaElement.classList.remove("tarjeta-activa");
        btnBloquear.disabled = true;
        btnDesbloquear.disabled = false;
      } else {
        estadoTarjetaElement.textContent = "Estado desconocido";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo obtener el estado de la tarjeta.");
    }
  }

  // --- BLOQUEAR TARJETA ---
  async function bloquearTarjeta() {
    try {
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/bloquear?id_cliente=${idCliente}`, {
        method: 'PUT'
      });

      if (response.ok) {
        await obtenerEstadoTarjeta();
        alert("Tarjeta bloqueada con éxito.");
      } else {
        alert("Error al bloquear la tarjeta.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al intentar bloquear la tarjeta.");
    }
  }

  // --- DESBLOQUEAR TARJETA ---
  async function desbloquearTarjeta() {
    try {
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/desbloquear?id_cliente=${idCliente}`, {
        method: 'PUT'
      });

      if (response.ok) {
        await obtenerEstadoTarjeta();
        alert("Tarjeta desbloqueada con éxito.");
      } else {
        alert("Error al desbloquear la tarjeta.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al intentar desbloquear la tarjeta.");
    }
  }

  btnBloquear.addEventListener("click", bloquearTarjeta);
  btnDesbloquear.addEventListener("click", desbloquearTarjeta);

  obtenerEstadoTarjeta();
});
