document.addEventListener('DOMContentLoaded', () => {

    // 1. SIMULACIÓN DE BASE DE DATOS (Array de Objetos)
    const baseDeDatos = [
        {
            id: 1,
            usuario: "Madelaine Reyes",
            avatar: "https://i.pravatar.cc/150?img=32",
            fecha: "15/12/2025",
            hora: "07:30",
            contenido: "¡Hola equipo! Acabo de subir los nuevos wireframes para la sección de testimonios. 🚀",
            likes: 12,
            comentarios: 2
        },
        {
            id: 2,
            usuario: "Oscar Chávez",
            avatar: "https://i.pravatar.cc/150?img=59",
            fecha: "15/12/2025",
            hora: "09:15",
            contenido: "Estuve revisando la documentación de la API de aduanas. ¡Tiene buena pinta para la integración! 📦",
            likes: 5,
            comentarios: 0
        },
        {
            id: 3,
            usuario: "Fernanda Tech",
            avatar: "https://i.pravatar.cc/150?img=5",
            fecha: "14/12/2025",
            hora: "18:45",
            contenido: "¿Alguien tiene experiencia con la librería Chart.js para los gráficos de exportación?",
            likes: 8,
            comentarios: 4
        }
    ];

    // 2. REFERENCIA AL CONTENEDOR EN EL HTML
    const contenedor = document.getElementById('contenedor-publicaciones');

    // 3. FUNCIÓN PARA RENDERIZAR (PINTAR) LAS PUBLICACIONES
    function renderizarPublicaciones() {
        // Limpiamos el contenedor por si acaso
        contenedor.innerHTML = '';

        // Recorremos la base de datos
        baseDeDatos.forEach((post) => {
            // Creamos el HTML de cada tarjeta
            const tarjetaHTML = `
                <article class="exportify-card post" style="margin-bottom: 20px;">
                    <div class="post-header">
                        <img class="avatar-post" src="${post.avatar}" alt="Avatar">
                        <div>
                            <h4>${post.usuario}</h4>
                            <span style="font-size: 0.8rem; color: #777;">${post.fecha} - ${post.hora}</span>
                        </div>
                    </div>
                    <div class="post-body">
                        <p>${post.contenido}</p>
                    </div>
                    <div class="post-footer">
                        <span><i class="far fa-heart"></i> ${post.likes}</span>
                        <span><i class="far fa-comment"></i> ${post.comentarios} Comentarios</span>
                    </div>
                </article>
            `;

            // Insertamos el HTML en el contenedor (+= concatena, no borra lo anterior)
            contenedor.innerHTML += tarjetaHTML;
        });
    }

    // 4. EJECUTAMOS LA FUNCIÓN INICIAL
    renderizarPublicaciones();

    // 5. (OPCIONAL) EJEMPLO DE CÓMO AGREGARÍAS UN NUEVO POST DESDE CÓDIGO
    // Esta función la podrías conectar al botón de "Crear Publicación" más adelante
    function agregarNuevoPost(textoUsuario) {
        const nuevoPost = {
            id: baseDeDatos.length + 1, // ID autoincremental simple
            usuario: "Francisco Lertora", // Usuario logueado actual
            avatar: "https://i.pravatar.cc/150?img=12",
            fecha: new Date().toLocaleDateString(), // Fecha actual
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            contenido: textoUsuario,
            likes: 0,
            comentarios: 0
        };

        // Agregamos al principio del array para que salga primero (unshift)
        baseDeDatos.unshift(nuevoPost);
        
        // Volvemos a pintar todo para ver el cambio
        renderizarPublicaciones();
    }

    // PRUEBA DE CONSOLA:
    // Si escribes agregarNuevoPost("Hola mundo") en la consola del navegador, verás cómo aparece.
    // Hacemos la función global para que puedas probarla desde la consola de Chrome/Firefox
    window.agregarNuevoPost = agregarNuevoPost;
});

    /* ==========================================
       NUEVA LÓGICA: LISTA DE SEGUIDOS
       ========================================== */

    // 1. DATA: Array de objetos para los seguidos
    const usuariosSeguidos = [
        {
            id: 101,
            nombre: "Madelaine Reyes",
            avatar: "https://i.pravatar.cc/150?img=32"
        },
        {
            id: 102,
            nombre: "Noemí Bontá",
            avatar: "https://i.pravatar.cc/150?img=9"
        },
        {
            id: 103, // ¡Eres tú mismo! (Opcional)
            nombre: "Oscar Chávez",
            avatar: "https://i.pravatar.cc/150?img=59" // Usé la misma foto que en tu post
        },
        {
            id: 104, 
            nombre: "Dev Team",
            avatar: "https://i.pravatar.cc/150?img=60" 
        }
    ];

    // 2. REFERENCIA: Buscamos la lista <ul> por su ID
    const listaSeguidos = document.getElementById('lista-seguidos');

    // 3. FUNCIÓN: Renderizar seguidos
    function renderizarSeguidos() {
        listaSeguidos.innerHTML = ''; // Limpiar lista

        usuariosSeguidos.forEach(usuario => {
            const itemHTML = `
                <li>
                    <img src="${usuario.avatar}" alt="${usuario.nombre}">
                    <span>${usuario.nombre}</span>
                </li>
            `;
            listaSeguidos.innerHTML += itemHTML;
        });
    }

    // 4. EJECUTAR: Llamamos a la función
    renderizarSeguidos();

    // ... (El resto de tu código, como agregarNuevoPost, sigue aquí) ...