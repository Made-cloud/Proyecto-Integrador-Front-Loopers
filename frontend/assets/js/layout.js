// Cargar SweetAlert2 dinámicamente para alertas bonitas
const swalScript = document.createElement('script');
swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(swalScript);

// DETECTAR LA RUTA BASE (Para saber si usar ../ o ./)
const path = window.location.pathname;
const basePath = path.includes("/pages/") ? "../" : "./";

// 1. CARGAR NAVBAR
fetch(basePath + "components/navbar.html")
    .then(response => {
        if (!response.ok) throw new Error("No se encontró navbar.html");
        return response.text();
    })
    .then(html => {
        const navbarElement = document.getElementById("navbar");
        if (navbarElement) {
            navbarElement.innerHTML = html;
            // Avisar que el navbar ya existe para actualizar el usuario
            document.dispatchEvent(new Event("navbarLoaded"));
        }
    })
    .catch(error => console.error("Error cargando navbar:", error));

// 2. CARGAR FOOTER
fetch(basePath + "components/footer.html")
    .then(response => {
        if (!response.ok) throw new Error("No se encontró footer.html");
        return response.text();
    })
    .then(html => {
        const footerElement = document.getElementById("footer");
        if (footerElement) {
            footerElement.innerHTML = html;
        }
    })
    .catch(error => console.error("Error cargando footer:", error));


// 3. LÓGICA DE USUARIO (Se activa cuando el navbar carga)
document.addEventListener("navbarLoaded", () => {
    actualizarNavbarConUsuario();
    // Actualizar contador del carrito también si existe la función
    if (typeof actualizarContador === "function") {
        actualizarContador();
    }
});

function actualizarNavbarConUsuario() {
    const token = localStorage.getItem('jwt_token');
    const userName = localStorage.getItem('user_name') || "Usuario";
    
    // 🔥 1. RECUPERAMOS EL ID DEL USUARIO
    const userId = localStorage.getItem('user_id'); 

    if (token) {
        const loginBtn = document.querySelector('.login-btn');
        
        if (loginBtn) {
            // Reemplazamos el botón simple por una estructura de Menú
            const dropdownHTML = `
                <div class="user-dropdown" id="userMenuBtn">
                    
                    <div class="user-trigger">
                        <i class="fas fa-user-circle" style="font-size: 1.5rem; color: #4CAF50;"></i>
                        <span style="font-weight: 600; color: #333;">${userName}</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: #666;"></i>
                    </div>
                    
                    <div id="myDropdown" class="dropdown-content">
                        <div style="padding: 10px 20px; border-bottom: 1px solid #eee; font-size: 0.85rem; color: #999;">
                            Mi Cuenta
                        </div>
                        
                        <a href="../pages/perfil.html?id=${userId}">
                            <i class="fas fa-id-card"></i> Perfil
                        </a>
                        
                        <a href="#" onclick="confirmarSalida(event)">
                            <i class="fas fa-sign-out-alt" style="color: #d33;"></i> Cerrar Sesión
                        </a>
                    </div>
                </div>
            `;

            loginBtn.outerHTML = dropdownHTML;

            // LÓGICA DEL MENÚ (Click para abrir/cerrar)
            const menuBtn = document.getElementById('userMenuBtn');
            const dropdown = document.getElementById('myDropdown');

            // Verificamos que los elementos existan antes de agregar eventos (por seguridad)
            if (menuBtn && dropdown) {
                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    dropdown.classList.toggle('show');
                });

                window.addEventListener('click', (e) => {
                    if (!menuBtn.contains(e.target)) {
                        dropdown.classList.remove('show');
                    }
                });
            }
        }
    }
}

// Función auxiliar para el logout (sigue usando SweetAlert para confirmar, pero solo al dar clic en la opción)
function confirmarSalida(e) {
    e.preventDefault();
    
    Swal.fire({
        title: '¿Cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003366',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            logout();
        }
    });
}

function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_data');
    window.location.reload();
}