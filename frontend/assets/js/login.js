const API_AUTH_URL = "http://localhost:8080/auth/login";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            togglePassword.innerHTML = type === 'password' 
                ? '<i class="fas fa-eye"></i>' 
                : '<i class="fas fa-eye-slash"></i>';
        });
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('generalError');
    if (errorDiv) errorDiv.textContent = "";

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        mostrarError("Por favor, completa todos los campos.");
        return;
    }

    const btnSubmit = event.target.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Conectando...";

    try {
        const response = await fetch(API_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt_token', data.token);
            window.location.href = "../index.html"; 
        } else {
            mostrarError("Usuario o contraseña incorrectos.");
        }

    } catch (error) {
        console.error(error);
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
}