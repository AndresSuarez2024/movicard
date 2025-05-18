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

    // Llenar gráfico de tarjetas cuando todo esté cargado
    llenarGraficaPie();
});

// Configuración de movimientos mensuales
const ctxMovimientos = document.getElementById('movimientosChart').getContext('2d');
const movimientosChart = new Chart(ctxMovimientos, {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Movimientos (€)',
      data: [200, 150, 300, 250, 400, 350],
      backgroundColor: 'rgba(52, 152, 219, 0.6)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


// ===============================
// Configuración del gráfico de pastel (tarjetas vendidas)
function llenarGraficaPie() {
  const tarjetas = [
    { nombre: "TENMOVI" },
    { nombre: "MOVIMES" },
    { nombre: "MOVIMES" },
    { nombre: "TRIMOVI" },
    { nombre: "SUSCRIPCIÓN PREMIUM" },
    { nombre: "TENMOVI" },
    // Agrega más tarjetas según sea necesario
  ];

  const conteo = {
    "TENMOVI": tarjetas.filter(t => t.nombre === "TENMOVI").length,
    "MOVIMES": tarjetas.filter(t => t.nombre === "MOVIMES").length,
    "TRIMOVI": tarjetas.filter(t => t.nombre === "TRIMOVI").length,
    "SUSCRIPCIÓN PREMIUM": tarjetas.filter(t => t.nombre === "SUSCRIPCIÓN PREMIUM").length
  };

  const labels = Object.keys(conteo);
  const data = Object.values(conteo);

// Gráfico de pastel - Tarjetas Vendidas
const ctxPie = document.getElementById('graficaPie').getContext('2d');

const dataPie = {
  labels: ['TENMOVI', 'MOVIMES', 'TRIMOVI'],
  datasets: [{
    data: [10, 7, 3], // Sustituye por tus datos reales
    backgroundColor: [
      'rgba(88, 214, 141, 0.7)',
      'rgba(93, 173, 226, 0.7)',
      'rgba(241, 148, 138, 0.7)'
    ],
    borderColor: [
      'rgba(88, 214, 141, 1)',
      'rgba(93, 173, 226, 1)',
      'rgba(241, 148, 138, 1)'
    ],
    borderWidth: 1
  }]
};

const optionsPie = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#000'
      }
    }
  }
};

const graficaPie = new Chart(ctxPie, {
  type: 'pie',
  data: dataPie,
  options: optionsPie
});

}
