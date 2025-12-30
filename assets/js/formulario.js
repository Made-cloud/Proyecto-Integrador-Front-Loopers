class SportifyAuth {
    constructor() {
        this.storageKey = 'sportify_users';
        this.init();
    }

    init() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.setAttribute('novalidate', true);
            form.onsubmit = (e) => this.handleRegister(e);
        }

        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.onclick = (e) => this.togglePasswordVisibility(e);
        });

        this.updateCurrentTime();
    }

    handleRegister(e) {
        e.preventDefault();
        this.clearAllErrors();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phonenumber').value.trim();
        const email = document.getElementById('email').value.trim();
        const pass1 = document.getElementById('password').value;
        const pass2 = document.getElementById('passwordcheck').value;

        let isValid = true;

        // --- VALIDACIONES ---
        if (!name || !phone || !email || !pass1) {
            this.showError('generalError', 'Todos los campos son obligatorios.');
            isValid = false;
        }

        const phoneDigits = phone.replace(/\D/g, ''); 
        if (phoneDigits.length < 8) {
            this.showError('phonenumberError', 'Teléfono inválido (mínimo 8 números).');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('emailError', 'Formato de correo electrónico incorrecto.');
            isValid = false;
        }

        if (pass1 !== pass2) {
            this.showError('passwordcheckError', 'Las contraseñas no coinciden.');
            isValid = false;
        }

        // --- FLUJO DE ÉXITO CON TIEMPOS PERSONALIZADOS ---
        if (isValid) {
            
            // 1. CREACIÓN DEL OBJETO Y JSON
            const usuarioObjeto = {
                nombreCompleto: name,
                numeroTelefono: phone,
                emailUsuario: email,
                password: pass1,
                metadata: { date: new Date().toISOString() }
            };

            const usuarioJSON = JSON.stringify(usuarioObjeto, null, 2);

            // 2. MOSTRAR EN CONSOLA
            console.group("DATOS DEL REGISTRO");
            console.log("OBJETO:", usuarioObjeto);
            console.log("JSON:\n", usuarioJSON);
            console.groupEnd();

            // 3. GUARDAR EN LOCALSTORAGE
            this.saveToStorage(usuarioObjeto);

            // 4. INICIO DE SECUENCIA DE MENSAJES
            
            // Primer mensaje por 15 segundos
            this.showSuccessMessage("¡Registro Exitoso! Objeto y JSON generados.");

            // Programamos el cambio al segundo mensaje después de 15 segundos (15000 ms)
            setTimeout(() => {
                this.showSuccessMessage("¡Registro Exitoso! Redirigiendo...");

                // Programamos la redirección final 5 segundos después (5000 ms)
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 5000);

            }, 15000);
        }
    }

    showError(id, msg) {
        const errorDiv = document.getElementById(id);
        if (errorDiv) {
            errorDiv.innerText = msg;
            errorDiv.style.display = 'block'; 
            errorDiv.style.color = '#ff4d4d';
        }
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.innerText = '';
            el.style.display = 'none';
        });
        const success = document.getElementById('successMessage');
        if (success) {
            success.innerText = '';
            success.style.display = 'none';
        }
    }

    showSuccessMessage(msg) {
        const success = document.getElementById('successMessage');
        if (success) {
            success.innerText = msg;
            success.style.display = 'block';
            success.style.color = '#2ecc71';
            success.style.fontWeight = 'bold';
        }
    }

    saveToStorage(user) {
        let users = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        users.push(user);
        localStorage.setItem(this.storageKey, JSON.stringify(users, null, 2));
    }

    togglePasswordVisibility(e) {
        const container = e.currentTarget.closest('.password-container');
        const input = container.querySelector('input');
        const icon = e.currentTarget.querySelector('i');
        
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

// Actualizar hora actual
    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const updateTime = () => {
                const now = new Date();
                timeElement.textContent = now.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            };
            
            updateTime();
            setInterval(updateTime, 1000);
        }
    }

    /* updateCurrentTime() {
        const timeEl = document.getElementById('currentTime');
        if (timeEl) {
            setInterval(() => {
                timeEl.innerText = "Hora local: " + new Date().toLocaleTimeString();
            }, 1000);
        }
    } 
        }
    }*/
}

document.addEventListener('DOMContentLoaded', () => {
    new SportifyAuth();
});