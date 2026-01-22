const API_BASE_URL = "http://localhost:8080/auth";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Configurar Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAuth(e, '/login');
        });
    }

    // Configurar Registro
    if (registerForm) {
        // Activamos la validación en tiempo real (ROJO/VERDE)
        setupRealTimeValidation();

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAuth(e, '/register');
        });
    }

    setupPasswordToggles();
});

/**
 * Validación visual mientras escribes
 */
function setupRealTimeValidation() {
    const pass1 = document.getElementById('password');
    const pass2 = document.getElementById('confirmPassword');

    if (!pass1 || !pass2) return;

    const messageSpan = document.createElement('span');
    messageSpan.className = 'match-message';
    pass2.parentElement.parentElement.appendChild(messageSpan);

    function validar() {
        const val1 = pass1.value;
        const val2 = pass2.value;

        if (val2 === "") {
            pass2.classList.remove('input-error', 'input-success');
            messageSpan.textContent = "";
            return;
        }

        if (val1 === val2) {
            pass2.classList.remove('input-error');
            pass2.classList.add('input-success');
            messageSpan.textContent = "✔ Las contraseñas coinciden";
            messageSpan.style.color = "#2ecc71";
        } else {
            pass2.classList.remove('input-success');
            pass2.classList.add('input-error');
            messageSpan.textContent = "✖ Las contraseñas no coinciden";
            messageSpan.style.color = "#ff4d4d";
        }
    }

    pass1.addEventListener('input', validar);
    pass2.addEventListener('input', validar);
}

async function handleAuth(event, endpoint) {
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.disabled = true;
    btn.innerText = "Procesando...";
    limpiarErrores();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // --- VALIDACIONES FINALES ---
    if (endpoint === '/register') {
        const pass1 = document.getElementById('password').value;
        const pass2 = document.getElementById('confirmPassword').value;

        if (pass1 !== pass2) {
            // Usamos SweetAlert para errores de validación graves
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Las contraseñas no coinciden.',
                confirmButtonColor: '#f39c12'
            });
            btn.disabled = false;
            btn.innerText = originalText;
            return;
        }
        
        data.role = "USER";
        delete data.confirmPassword;
    }

    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            
            if (result.token) {
                localStorage.setItem('jwt_token', result.token);
                const userName = result.user ? result.user.name : (data.name || data.email);
                localStorage.setItem('user_name', userName);
            }

            // --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE (SweetAlert) ---
            Swal.fire({
                title: endpoint === '/login' ? '¡Bienvenido!' : '¡Cuenta Creada!',
                text: endpoint === '/login' ? 'Has iniciado sesión correctamente.' : 'Tu registro fue exitoso.',
                icon: 'success',
                confirmButtonColor: '#003366',
                confirmButtonText: 'Continuar'
            }).then((result) => {
                // Redirigir cuando el usuario cierre la alerta
                window.location.href = "../index.html";
            });

        } else {
            const errorText = await response.text();
            console.error("Error Auth:", errorText);
            
            // Alerta de Error del Servidor
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: 'Credenciales incorrectas o el usuario ya existe.',
                confirmButtonColor: '#d33'
            });
        }

    } catch (error) {
        console.error(error);
<<<<<<< HEAD
        // Alerta de Error de Conexión
        Swal.fire({
            icon: 'error',
            title: 'Sin conexión',
            text: 'No se pudo conectar con el servidor. Intenta más tarde.',
            confirmButtonColor: '#d33'
        });
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

function mostrarError(form, mensaje) {
    const errorDiv = form.querySelector('.error-message') || document.getElementById('generalError');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    }
}

function limpiarErrores() {
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const btn = e.target.closest('.toggle-password');
            const icon = btn.querySelector('i');
            const input = btn.previousElementSibling;

            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });
=======
        mostrarError("No se pudo conectar con el servidor.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('generalError');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('show');
    } else {
        alert(mensaje);
    }
>>>>>>> 6217210c0c92d5e48c0476ab1573c8817507bf42
}