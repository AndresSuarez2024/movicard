document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const clienteId = localStorage.getItem('clienteId');
    const nombre = localStorage.getItem('nombreUsuario');
    const userNameElement = document.getElementById('user-name');

    if (nombre && userNameElement) {
        userNameElement.textContent = nombre;
        userNameElement.onclick = () => window.location.href = 'perfil.html';
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'inicio-btn') {
                window.location.href = 'freemium.html';
            } else if (item.id === 'recargar-btn') {
                window.location.href = 'recargaFreemium.html'; 
            } else if (item.id === 'bloqueo-btn') {
                window.location.href = 'bloqueoTarjeta.html';
            } else if (item.id === 'atencion-btn') {
                window.location.href = 'atencionCliente.html';
            }
        });
    });

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Aquí puedes agregar los valores de los inputs si quieres simular el pago
        const cardNumber = document.getElementById('cardNumber').value;
        const cardHolder = document.getElementById('cardHolder').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        console.log({
            cardNumber,
            cardHolder,
            expiryDate,
            cvv
        });

        // Simulamos el pago exitoso
        alert("Pago realizado con éxito");

        // Redirigir a la página de inicio
        window.location.href = 'inicio.html';
    });
});
