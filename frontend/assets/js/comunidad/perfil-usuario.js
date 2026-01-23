import { renderizarPublicaciones } from "./render.js";

// Obtención de parámetros URL y credenciales
const params = new URLSearchParams(window.location.search);
const urlUserId = params.get("id");
const localUserId = localStorage.getItem("user_id");
const token = localStorage.getItem("jwt_token");

// Determinar qué perfil mostrar (URL o Usuario Logueado)
const targetUserId = urlUserId || localUserId;

document.addEventListener("DOMContentLoaded", async () => {
    // Redirección si no hay sesión ni ID válido
    if (!targetUserId || !token) {
        window.location.href = "comunidad.html";
        return;
    }

    await cargarDatosCabecera();
    await cargarPostsDelPerfil();
    configurarEventos();
});

// Carga información del usuario (Nombre, Email, Avatar)
async function cargarDatosCabecera() {
    try {
        const response = await fetch(`http://localhost:8080/users/${targetUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            
            // Actualización DOM
            document.getElementById("header-nombre").textContent = user.name;
            document.getElementById("header-email").textContent = user.email;
            
            // Avatar
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`;
            document.getElementById("header-avatar").src = avatarUrl;

            // Renderizado de botón de cabecera (Seguir o Editar)
            renderizarBotonCabecera();
        } else {
            document.getElementById("header-nombre").textContent = "Usuario no encontrado";
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }
}

// Renderiza el botón principal del perfil
async function renderizarBotonCabecera() {
    const contenedor = document.getElementById("contenedor-acciones");
    contenedor.innerHTML = '';

    // Caso 1: Estoy en mi propio perfil
    if (targetUserId === localUserId) {
        contenedor.innerHTML = `
            <button class="btn-outline" style="border: 1px solid #ccc; background: white; padding: 8px 20px; border-radius: 20px; cursor: default;">
                <i class="fas fa-user-check"></i> Es tu perfil
            </button>`;
        return;
    }

    // Caso 2: Perfil de otro usuario (Verificar si lo sigo)
    try {
        const response = await fetch(`http://localhost:8080/users/${localUserId}/following`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const seguidos = await response.json();
            const yaLoSigo = seguidos.some(u => u.id == targetUserId);
            
            const texto = yaLoSigo ? "Siguiendo" : "Seguir";
            const estilo = yaLoSigo 
                ? "background: #eee; color: #333;" 
                : "background: #003366; color: white;";

            const btn = document.createElement("button");
            btn.innerHTML = `<i class="fas fa-user-plus"></i> ${texto}`;
            btn.style.cssText = `border: none; padding: 10px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; ${estilo}`;
            
            // Evento Click para Seguir/Dejar de seguir
            btn.onclick = () => manejarSeguirPerfil(btn, yaLoSigo);
            
            contenedor.appendChild(btn);
        }
    } catch (e) {
        console.error("Error verificando seguimiento", e);
    }
}

// Lógica para seguir desde la cabecera
async function manejarSeguirPerfil(btn, estadoActualSiguiendo) {
    btn.disabled = true;
    const url = `http://localhost:8080/users/${localUserId}/${estadoActualSiguiendo ? 'unfollow' : 'follow'}/${targetUserId}`;
    const method = estadoActualSiguiendo ? 'DELETE' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            // Recargar estado del botón
            renderizarBotonCabecera();
        }
    } catch (e) {
        console.error(e);
    } finally {
        btn.disabled = false;
    }
}

// Carga los posts filtrados por usuario
async function cargarPostsDelPerfil() {
    try {
        const response = await fetch(`http://localhost:8080/posts/user/${targetUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const contenedor = document.getElementById("contenedor-publicaciones");

        if (response.ok) {
            const posts = await response.json();
            
            if (posts.length === 0) {
                contenedor.innerHTML = `<p style="text-align:center; color:#888; margin-top:30px;">Este usuario aún no tiene publicaciones.</p>`;
                return;
            }

            // Mapeo de datos para compatibilidad con render.js
            const postsMapeados = posts.map(p => ({
                id: p.id,
                authorId: parseInt(targetUserId),
                usuario: p.authorName,
                avatar: p.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.authorName)}`,
                timestamp: new Date(p.createdAt).getTime(),
                contenido: p.content,
                imagen: p.imageUrl,
                likes: p.likes
            }));

            // Reutilizamos el renderizador. Pasamos array vacío en "seguidos" ya que el botón de cabecera maneja eso.
            renderizarPublicaciones(postsMapeados, contenedor, []); 

        } else {
            contenedor.innerHTML = "<p>Error al cargar publicaciones.</p>";
        }
    } catch (error) {
        console.error("Error fetch posts:", error);
    }
}

// Configuración de eliminación de posts
function configurarEventos() {
    const contenedor = document.getElementById("contenedor-publicaciones");
    
    contenedor.addEventListener("click", async (e) => {
        // Delegación de eventos para botón eliminar
        const btnEliminar = e.target.closest("button[data-action='delete']");
        
        if (btnEliminar) {
            const postId = btnEliminar.dataset.postid;
            
            const confirmacion = await Swal.fire({
                title: '¿Eliminar publicación?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (confirmacion.isConfirmed) {
                eliminarPost(postId);
            }
        }
    });
}

async function eliminarPost(postId) {
    try {
        const res = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok || res.status === 204) {
            Swal.fire('Eliminado', 'La publicación ha sido eliminada.', 'success');
            // Remover visualmente sin recargar
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) postElement.remove();
        } else {
            Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
        }
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Fallo de conexión.', 'error');
    }
}