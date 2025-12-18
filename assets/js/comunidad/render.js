import { calcularTiempoRelativo } from './utils.js';

// --- FUNCIONES DE DIBUJADO (RENDER) ---

// 1. Dibuja la lista de amigos en la barra lateral
export function renderizarSeguidos(listaUsuarios, elementoContenedor) {
    elementoContenedor.innerHTML = ''; // Limpiamos antes de pintar
    listaUsuarios.forEach(u => {
        elementoContenedor.innerHTML += `<li><img src="${u.avatar}"><span>${u.nombre}</span></li>`;
    });
}

// 2. Dibuja todas las publicaciones en el centro
export function renderizarPublicaciones(listaPosts, elementoContenedor) {
    elementoContenedor.innerHTML = '';
    
    listaPosts.forEach((post) => {
        const tiempoPost = calcularTiempoRelativo(post.timestamp);
        
        // Si hay imagen, creamos la etiqueta img, si no, queda vacío
        let imagenHTML = post.imagen ? `<img src="${post.imagen}" class="post-img">` : '';
        
        // Logica visual del Like (Rojo si ya le di like)
        const corazonIcono = post.meGusta ? 'fas fa-heart' : 'far fa-heart';
        const claseActiva = post.meGusta ? 'like-activo' : '';

        // Construimos el HTML de los comentarios (si existen)
        let htmlComentarios = '';
        if (post.comentarios.length > 0) {
            htmlComentarios = `<div class="caja-comentarios">`;
            post.comentarios.forEach(com => {
                const tiempoComentario = calcularTiempoRelativo(com.timestamp);
                htmlComentarios += `
                    <div class="comentario-item">
                        <div class="comentario-content">
                            <strong>${com.usuario} <span style="font-weight:normal; font-size:0.8em; color:#888;">• ${tiempoComentario}</span></strong>
                            <p>${com.texto}</p>
                        </div>
                    </div>
                `;
            });
            htmlComentarios += `</div>`;
        }

        // Armamos la tarjeta completa
        const tarjetaHTML = `
            <article class="exportify-card post" style="margin-bottom: 20px;">
                <div class="post-header">
                    <img class="avatar-post" src="${post.avatar}" alt="Avatar">
                    <div>
                        <h4>${post.usuario}</h4>
                        <span style="font-size: 0.8rem; color: #777;">${tiempoPost}</span>
                    </div>
                </div>
                
                <div class="post-body">
                    <p>${post.contenido}</p>
                    ${imagenHTML}
                </div>

                <div class="post-footer">
                    <span class="accion-btn btn-like ${claseActiva}" data-id="${post.id}">
                        <i class="${corazonIcono}"></i> ${post.likes}
                    </span>
                    
                    <span class="accion-btn btn-comment" data-id="${post.id}">
                        <i class="far fa-comment"></i> ${post.comentarios.length} Comentarios
                    </span>
                </div>

                <div class="formulario-comentario" id="form-comentario-${post.id}">
                    <input type="text" placeholder="Escribe una respuesta..." />
                    <button class="btn-enviar-comentario" data-id="${post.id}">Enviar</button>
                </div>

                ${htmlComentarios}
            </article>
        `;
        elementoContenedor.innerHTML += tarjetaHTML;
    });
}