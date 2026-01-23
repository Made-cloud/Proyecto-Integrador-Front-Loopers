import { calcularTiempoRelativo } from './utils.js';

// Renderiza la lista de publicaciones en el contenedor DOM especificado
export function renderizarPublicaciones(listaPosts, elementoContenedor, misSeguidos = []) {
    elementoContenedor.innerHTML = '';
    
    const miId = parseInt(localStorage.getItem('user_id')); 

    listaPosts.forEach((post) => {
        const tiempoPost = calcularTiempoRelativo(post.timestamp);
        let imagenHTML = post.imagen ? `<img src="${post.imagen}" class="post-img">` : '';
        const corazonIcono = post.meGusta ? 'fas fa-heart' : 'far fa-heart';
        
        let botonAccionHTML = '';
        
        // Lógica: Si soy el autor, muestro eliminar. Si no, muestro seguir.
        if (post.authorId && post.authorId === miId) {
            // Botón Eliminar (Visible solo para el dueño)
            botonAccionHTML = `
                <button class="btn-text delete-post-btn" 
                        data-action="delete" 
                        data-postid="${post.id}"
                        style="color: #dc3545; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>`;
        } else if (post.authorId) {
            // Botón Seguir (Visible para otros)
            const yaLoSigo = misSeguidos.includes(post.authorId);
            const texto = yaLoSigo ? 'Siguiendo' : 'Seguir';
            
            // Estilos dinámicos según estado
            const estiloBtn = yaLoSigo 
                ? 'background:#e0e0e0; color:#333; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-size:0.8em; font-weight:600;' 
                : 'background:#003366; color:white; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-size:0.8em; font-weight:600;';

            botonAccionHTML = `
                <button style="${estiloBtn}" 
                        data-action="follow" 
                        data-userid="${post.authorId}">
                    ${texto}
                </button>`;
        }

        const linkPerfil = `<a href="perfil.html?id=${post.authorId}" style="text-decoration:none; color:inherit; font-weight:700;">${post.usuario}</a>`;

        const tarjetaHTML = `
            <article class="exportify-card post" id="post-${post.id}" style="margin-bottom: 20px; animation: fadeIn 0.5s ease;">
                <div class="post-header" style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <a href="perfil.html?id=${post.authorId}">
                            <img class="avatar-post" src="${post.avatar}" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                        </a>
                        <div>
                            <h4 style="margin:0; font-size: 0.95rem;">${linkPerfil}</h4>
                            <span style="font-size: 0.75rem; color: #777;">${tiempoPost}</span>
                        </div>
                    </div>
                    <div>${botonAccionHTML}</div>
                </div>
                
                <div class="post-body" style="margin-top: 15px;">
                    <p style="white-space: pre-wrap;">${post.contenido}</p>
                    ${imagenHTML}
                </div>

                <div class="post-footer" style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                    <span class="accion-btn btn-like" data-id="${post.id}" style="cursor: pointer; margin-right: 20px; color: #555;">
                        <i class="${corazonIcono}"></i> ${post.likes}
                    </span>
                    <span class="accion-btn" style="cursor: pointer; color: #555;">
                        <i class="far fa-comment"></i> 0 Comentarios
                    </span>
                </div>
            </article>
        `;
        elementoContenedor.innerHTML += tarjetaHTML;
    });
}

export function renderizarSeguidos(listaUsuarios, elementoContenedor) {
    // 1. Limpiamos el contenedor
    elementoContenedor.innerHTML = '';

    // 2. Si la lista está vacía, mostramos mensaje
    if (!listaUsuarios || listaUsuarios.length === 0) {
        elementoContenedor.innerHTML = '<p style="color:#777; font-size:0.9rem; padding:10px;">Aún no sigues a nadie.</p>';
        return;
    }

    // 3. Recorremos los usuarios y creamos su HTML
    listaUsuarios.forEach(user => {
        // Fallback por si la foto o el nombre vienen vacíos
        const avatar = user.profilePhoto || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        const nombre = user.name || "Usuario";
        const id = user.id || user.id_users; // Ajusta según cómo lo envíe tu Java

        const html = `
            <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 0 10px;">
                <a href="perfil.html?id=${id}">
                    <img src="${avatar}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
                </a>
                <a href="perfil.html?id=${id}" style="text-decoration: none; color: #333; font-weight: 600; font-size: 0.9rem;">
                    ${nombre}
                </a>
            </div>
        `;
        elementoContenedor.innerHTML += html;
    });
}