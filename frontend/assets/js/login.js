// Clase para manejar la autenticación
class AuthenticationSystem {
    constructor() {
        this.usersKey = 'loginSystemUsers';
        this.currentUserKey = 'loginSystemCurrentUser';
        this.init();
    }

    // Inicializar el sistema
    init() {
        this.setupEventListeners();
        this.checkLocalStorage();
        this.loadTestUsers();
        this.updateStorageStatus();
        this.updateCurrentTime();
        this.checkRememberedUser();
    }

    // Verificar si localStorage está disponible
    checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            this.showError('general', 'LocalStorage no está disponible. La aplicación no funcionará correctamente.');
            return false;
        }
    }

    // Cargar usuarios de prueba
    loadTestUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            const testUsers = [
                { id: 1, email: 'admin@test.com', password: 'Admin123', name: 'Administrador', role: 'admin' },
                { id: 2, email: 'usuario@test.com', password: 'User123', name: 'Usuario Normal', role: 'user' },
                { id: 3, email: 'invitado@test.com', password: 'Guest123', name: 'Invitado', role: 'guest' }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(testUsers));
        }
        this.updateUsersCount();
    }

    // Actualizar contador de usuarios
    updateUsersCount() {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        document.getElementById('usersCount').textContent = `Usuarios cargados: ${users.length}`;
    }

    // Actualizar estado de almacenamiento
    updateStorageStatus() {
        const isAvailable = this.checkLocalStorage();
        const statusEl = document.getElementById('storageStatus');
        if (isAvailable) {
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> LocalStorage disponible';
            statusEl.style.color = '#27ae60';
        } else {
            statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> LocalStorage no disponible';
            statusEl.style.color = '#e74c3c';
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle de contraseña
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Validación en tiempo real
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearError('email'));
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword());
            passwordInput.addEventListener('input', () => this.clearError('password'));
        }

        // Verificar si estamos en la página de inicio
        if (window.location.pathname.includes('inicio.html')) {
            this.setupInicioPage();
        }
    }

    // Manejar inicio de sesión
    handleLogin(e) {
        e.preventDefault();
        
        // Limpiar mensajes anteriores
        this.clearAllErrors();
        this.hideSuccessMessage();

        // Validar campos
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            this.showError('general', 'Por favor, corrige los errores en el formulario.');
            return;
        }

        // Obtener valores del formulario
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Autenticar usuario
        const user = this.authenticateUser(email, password);

        if (user) {
            // Guardar usuario actual
            if (remember) {
                localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            } else {
                sessionStorage.setItem(this.currentUserKey, JSON.stringify(user));
            }

            // Mostrar mensaje de éxito
            this.showSuccessMessage(`¡Bienvenido, ${user.name}! Redirigiendo...`);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = 'inicio.html';
            }, 2000);
        } else {
            this.showError('general', 'Correo electrónico o contraseña incorrectos.');
        }
    }

    // Autenticar usuario
    authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        return users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    // Validar email
    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            this.showError('email', 'El correo electrónico es obligatorio.');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('email', 'Por favor, introduce un correo electrónico válido.');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    // Validar contraseña
    validatePassword() {
        const password = document.getElementById('password').value;
        const passwordError = document.getElementById('passwordError');
        
        if (!password) {
            this.showError('password', 'La contraseña es obligatoria.');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        
        this.clearError('password');
        return true;
    }

    // Mostrar/ocultar contraseña
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    // Verificar usuario recordado
    checkRememberedUser() {
        const rememberedUser = localStorage.getItem(this.currentUserKey);
        if (rememberedUser) {
            try {
                const user = JSON.parse(rememberedUser);
                document.getElementById('email').value = user.email;
                document.getElementById('remember').checked = true;
            } catch (e) {
                console.error('Error al cargar usuario recordado:', e);
            }
        }
    }

    // Configurar página de inicio
    setupInicioPage() {
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        // Mostrar información del usuario
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
        document.getElementById('loginTime').textContent = new Date().toLocaleString();
        
        // Configurar botón de logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    // Obtener usuario actual
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey) || sessionStorage.getItem(this.currentUserKey);
        if (!userData) return null;
        
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Error al parsear usuario:', e);
            return null;
        }
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem(this.currentUserKey);
        sessionStorage.removeItem(this.currentUserKey);
        window.location.href = 'index.html';
    }

    // Mostrar mensaje de error
    showError(field, message) {
        const errorElement = document.getElementById(field === 'general' ? 'generalError' : `${field}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Limpiar error
    clearError(field) {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Limpiar todos los errores
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
    }

    // Mostrar mensaje de éxito
    showSuccessMessage(message) {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
        }
    }

    // Ocultar mensaje de éxito
    hideSuccessMessage() {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
            successElement.classList.remove('show');
        }
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
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AuthenticationSystem();
});