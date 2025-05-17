document.addEventListener('DOMContentLoaded', () => {
  const nombre = localStorage.getItem('nombreUsuario');
  const userNameElement = document.getElementById('user-name');
  const idCliente = parseInt(localStorage.getItem("clienteId")); // 🔧 fuerza tipo
  const tarjetaId = parseInt(localStorage.getItem("tarjetaId")); // 🔧 fuerza tipo

  console.log("📌 ID Cliente:", idCliente);
  console.log("📌 ID Tarjeta:", tarjetaId);

  if (nombre && userNameElement) {
    userNameElement.textContent = nombre;
    userNameElement.onclick = () => window.location.href = 'perfil.html';
  }

  if (!idCliente || !tarjetaId) {
    alert("No se encontró el ID del cliente o de la tarjeta.");
    console.warn("🚫 ID Cliente o Tarjeta inválido:", idCliente, tarjetaId);
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
      console.log("🔄 Consultando estado de la tarjeta:", tarjetaId);
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/${tarjetaId}`);
      if (!response.ok) throw new Error("Error al obtener la tarjeta.");
      const data = await response.json();
      console.log("✅ Datos recibidos:", data);

      const estado = data.estadotarjeta;
      const uuid = data.UUID;

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
      console.error("❌ Error al obtener el estado de la tarjeta:", error);
      alert("No se pudo obtener el estado de la tarjeta.");
    }
  }

  // --- BLOQUEAR TARJETA ---
  async function bloquearTarjeta() {
    try {
      console.log("🔐 Intentando bloquear tarjeta para cliente:", idCliente);
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/bloquear?id_cliente=${idCliente}`, {
        method: 'PUT'
      });

      if (response.ok) {
        console.log("✅ Tarjeta bloqueada");
        await obtenerEstadoTarjeta();
        alert("Tarjeta bloqueada con éxito.");
      } else {
        const errorText = await response.text();
        console.warn("⚠️ Error al bloquear:", errorText);
        alert("Error al bloquear la tarjeta.");
      }
    } catch (error) {
      console.error("❌ Error de conexión al bloquear:", error);
      alert("Error de conexión al intentar bloquear la tarjeta.");
    }
  }

  // --- DESBLOQUEAR TARJETA ---
  async function desbloquearTarjeta() {
    try {
      console.log("🔓 Intentando desbloquear tarjeta para cliente:", idCliente);
      const response = await fetch(`http://34.224.233.49:8000/api/tarjetas/desbloquear?id_cliente=${idCliente}`, {
        method: 'PUT'
      });

      if (response.ok) {
        console.log("✅ Tarjeta desbloqueada");
        await obtenerEstadoTarjeta();
        alert("Tarjeta desbloqueada con éxito.");
      } else {
        const errorText = await response.text();
        console.warn("⚠️ Error al desbloquear:", errorText);
        alert("Error al desbloquear la tarjeta.");
      }
    } catch (error) {
      console.error("❌ Error de conexión al desbloquear:", error);
      alert("Error de conexión al intentar desbloquear la tarjeta.");
    }
  }

  btnBloquear.addEventListener("click", bloquearTarjeta);
  btnDesbloquear.addEventListener("click", desbloquearTarjeta);

  obtenerEstadoTarjeta();
});
