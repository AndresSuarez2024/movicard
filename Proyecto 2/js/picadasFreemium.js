document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Script cargado");
    
    const nombre = localStorage.getItem('nombreUsuario');
    const userNameElement = document.getElementById('user-name');
    const clienteId = localStorage.getItem('clienteId');

    console.log("🧠 nombreUsuario:", nombre);
    console.log("🧠 clienteId:", clienteId);

    if (nombre && userNameElement) {
        userNameElement.textContent = nombre;
        userNameElement.onclick = () => window.location.href = 'perfil.html';
    }

    if (!clienteId) {
        console.warn("⚠️ clienteId no encontrado en localStorage. Deteniendo ejecución.");
        return;
    }

    fetch(`http://34.224.233.49:8000/api/ticket/${clienteId}`)
        .then(res => res.json())
        .then(data => {
            console.log("📦 Datos del ticket recibidos:", data); // ✅ LOG AÑADIDO AQUÍ

            const tipo = (data.tipo || '').toUpperCase();
            const duracion = parseInt(data.duracion_dias || 0);
            const fechaInicio = new Date(data.fecha_inicio);
            const saldo = data.cantidad ?? 0;

            document.getElementById("tipoTicket").textContent = tipo;
            document.getElementById("fechaInicio").textContent = fechaInicio.toLocaleDateString('es-ES');

            const fechaExp = new Date(fechaInicio);
            fechaExp.setDate(fechaInicio.getDate() + duracion);
            document.getElementById("fechaExpiracion").textContent = duracion > 0 ? fechaExp.toLocaleDateString('es-ES') : "N/A";

            const saldoElement = document.getElementById("saldoPicadas");
            const progressFill = document.getElementById("progress-fill");

            if (tipo === "MOVIMES" || tipo === "TRIMOVI") {
                saldoElement.textContent = "∞ usos restantes";
                saldoElement.style.color = "green";
                progressFill.style.width = "100%";
                progressFill.style.backgroundColor = "green";
            } else {
                const saldoMostrar = saldo;
                saldoElement.textContent = `${saldoMostrar} usos restantes`;
                const porcentaje = (saldoMostrar / 10) * 100;
                progressFill.style.width = `${porcentaje}%`;

                if (saldoMostrar <= 3) {
                    saldoElement.style.color = "red";
                    progressFill.style.backgroundColor = "red";
                } else if (saldoMostrar <= 6) {
                    saldoElement.style.color = "orange";
                    progressFill.style.backgroundColor = "orange";
                } else {
                    saldoElement.style.color = "green";
                    progressFill.style.backgroundColor = "green";
                }
            }
        })
        .catch(err => {
            console.error("❌ Error al obtener datos del ticket:", err);
            document.getElementById("tipoTicket").textContent = "Tarjeta MoviCard";
            document.getElementById("saldoPicadas").textContent = "Error al cargar";
        });

    document.getElementById("recargarBtn").addEventListener("click", () => {
        alert("Redirigiendo a la página de recarga...");
        window.location.href = "recargaPremium.html";
    });

    // Menú lateral
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('expanded');
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const urls = {
                'inicio-btn': 'freemium.html',
                'recargar-btn': 'recargaPremium.html',
                'bloqueo-btn': 'bloqueoTarjeta.html',
                'atencion-btn': 'atencionCliente.html'
            };
            if (urls[item.id]) window.location.href = urls[item.id];
        });
    });
});
