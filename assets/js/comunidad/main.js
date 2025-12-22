// Importamos las piezas de nuestro rompecabezas desde los otros archivos
import { baseDeDatos, usuariosSeguidos } from './data.js';
import { renderizarPublicaciones, renderizarSeguidos } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS AL DOM ---
    const contenedor = document.getElementById('contenedor-publicaciones');
    const listaSeguidosDOM = document.getElementById('lista-seguidos');
    const modal = document.getElementById('reviewModal');
    const form = document.getElementById('reviewForm');
    

    // Botones del Modal
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnCerrarModal = document.getElementById('btnCloseModal');

    // --- INICIALIZACIÓN ---
    // Pintamos la pantalla por primera vez
    renderizarPublicaciones(baseDeDatos, contenedor);
    renderizarSeguidos(usuariosSeguidos, listaSeguidosDOM);

    // --- MANEJO DE CLICKS (EVENT DELEGATION) ---
    // Usamos un solo "listener" en el contenedor grande para no sobrecargar el navegador
    contenedor.addEventListener('click', (e) => {
        
        // 1. CLICK EN ME GUSTA
        const btnLike = e.target.closest('.btn-like');
        if (btnLike) {
            const id = parseInt(btnLike.dataset.id);
            toggleLike(id);
        }

        // 2. CLICK EN COMENTAR (Muestra/Oculta la cajita)
        const btnComment = e.target.closest('.btn-comment');
        if (btnComment) {
            const id = btnComment.dataset.id;
            const cajaInput = document.getElementById(`form-comentario-${id}`);
            cajaInput.classList.toggle('mostrar'); // Clase CSS que cambia display:none a flex
            
            // Ponemos el cursor en el input automáticamente
            if(cajaInput.classList.contains('mostrar')) {
                cajaInput.querySelector('input').focus();
            }
        }

        // 3. CLICK EN ENVIAR COMENTARIO
        const btnEnviar = e.target.closest('.btn-enviar-comentario');
        if (btnEnviar) {
            const id = parseInt(btnEnviar.dataset.id);
            const input = btnEnviar.previousElementSibling; // El input está justo antes del botón
            
            if (input.value.trim() !== "") {
                agregarComentario(id, input.value);
            }
        }
    });

    // --- LÓGICA DE DATOS ---
    
    function toggleLike(id) {
        // Buscamos el post específico en nuestro array
        const post = baseDeDatos.find(p => p.id === id);
        if (post) {
            // Cambiamos el estado (si era true pasa a false y viceversa)
            post.meGusta = !post.meGusta;
            // Ajustamos el contador
            post.likes += post.meGusta ? 1 : -1;
            
            // Volvemos a pintar todo para ver los cambios
            renderizarPublicaciones(baseDeDatos, contenedor);
        }
    }

    function agregarComentario(id, texto) {
        const post = baseDeDatos.find(p => p.id === id);
        if (post) {
            // Agregamos el nuevo comentario al array del post
            post.comentarios.push({
                usuario: "Francisco Lertora", // Simulamos que soy yo
                texto: texto,
                timestamp: Date.now()
            });
            renderizarPublicaciones(baseDeDatos, contenedor);
        }
    }

    // --- LÓGICA DEL MODAL (NUEVA PUBLICACIÓN) ---
    
    if (btnAbrirModal && modal) {
        btnAbrirModal.addEventListener('click', () => modal.style.display = 'flex');
        btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
        // Cierra el modal si clickeas afuera de la cajita blanca
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    }

    // Manejo del Formulario de crear post
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            const texto = document.getElementById('inputText').value;
            const inputFile = document.getElementById('inputImage');

            // Si subieron imagen, la procesamos, si no, guardamos null
            if (inputFile.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => crearPost(texto, ev.target.result);
                reader.readAsDataURL(inputFile.files[0]);
            } else {
                crearPost(texto, null);
            }
        });
    }

    function crearPost(texto, imagenBase64) {
        const nuevoPost = {
            id: Date.now(), // Usamos la fecha como ID único
            usuario: "Francisco Lertora",
            avatar: "https://i.pravatar.cc/150?img=12",
            timestamp: Date.now(),
            contenido: texto,
            imagen: imagenBase64,
            likes: 0,
            meGusta: false,
            comentarios: []
        };
        
        // Agregamos el post al inicio del array (unshift)
        baseDeDatos.unshift(nuevoPost);
        renderizarPublicaciones(baseDeDatos, contenedor);
        
        // Limpiamos y cerramos
        form.reset();
        modal.style.display = 'none';
    }
});