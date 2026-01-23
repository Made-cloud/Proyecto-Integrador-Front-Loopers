// main.js - Conectado al Backend

import { renderizarPublicaciones, renderizarSeguidos } from "./render.js";
import { usuariosSeguidos } from "./data.js";

const API_URL = "http://localhost:8080/posts";
let misSeguidos = []; // Lista local de IDs que sigo

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-publicaciones");
  const modal = document.getElementById("reviewModal");
  const form = document.getElementById("reviewForm");
  const btnAbrirModal = document.getElementById("btn-abrir-modal");
  const btnCerrarModal = document.getElementById("btnCloseModal");

  // 🔥 CARGA MAESTRA: Primero seguidos, luego posts
  inicializarFeed();

  async function inicializarFeed() {
    await cargarMisSeguidos();
    await cargarPublicaciones();
    actualizarTarjetaPerfil();
  }

  // --- 1. Obtener lista de seguidos desde Java ---
  async function cargarMisSeguidos() {
    const myId = localStorage.getItem('user_id');
    const token = localStorage.getItem('jwt_token');
    const contenedorSeguidos = document.getElementById("contenedor-seguidos"); 

    if (!myId || !token) return;

    try {
        const res = await fetch(`http://localhost:8080/users/${myId}/following`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const lista = await res.json();
            
            // 1. Guardamos los IDs para la lógica de botones
            misSeguidos = lista.map(u => u.id); 
            
            // 2. ¡PINTAMOS LA LISTA EN EL HTML!
            if (contenedorSeguidos) {
                renderizarSeguidos(lista, contenedorSeguidos);
            }
        }
    } catch (e) { console.error("Error cargando seguidos", e); }
}

  // --- 2. Cargar Posts ---
  async function cargarPublicaciones() {
    const token = localStorage.getItem("jwt_token"); // <--- 1. Recuperar token

    try {
      // 2. Agregar headers al fetch
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const listaJava = await response.json();
        const listaMapeada = listaJava.map((post) => mapearPost(post));

        renderizarPublicaciones(listaMapeada, contenedor, misSeguidos);
      } else {
        console.error("Error al cargar posts. Estado:", response.status); // <--- Ayuda a depurar
      }
    } catch (error) {
      console.error(error);
      contenedor.innerHTML =
        "<p style='text-align:center'>Error de conexión 🔌</p>";
    }
  }

  // --- 3. Manejo de Clicks (Seguir) ---
  contenedor.addEventListener("click", async (e) => {
    // Si click en botón SEGUIR
    if (e.target.dataset.action === "follow") {
      const btn = e.target;
      const targetId = btn.dataset.userid;
      await manejarSeguir(targetId, btn);
    }
  });

  async function manejarSeguir(targetId, btn) {
    const myId = localStorage.getItem("user_id");
    const token = localStorage.getItem("jwt_token");

    const yaLoSigo = misSeguidos.includes(parseInt(targetId));
    const url = yaLoSigo
      ? `http://localhost:8080/users/${myId}/unfollow/${targetId}`
      : `http://localhost:8080/users/${myId}/follow/${targetId}`;
    const metodo = yaLoSigo ? "DELETE" : "POST";

    btn.disabled = true;
    const textoOriginal = btn.innerText;
    btn.innerText = "...";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (yaLoSigo) {
          misSeguidos = misSeguidos.filter((id) => id != targetId);
          btn.innerText = "Seguir";
          btn.classList.remove("btn-siguiendo");
          btn.classList.add("btn-seguir");
        } else {
          misSeguidos.push(parseInt(targetId));
          btn.innerText = "Siguiendo";
          btn.classList.remove("btn-seguir");
          btn.classList.add("btn-siguiendo");
        }
      } else {
        btn.innerText = textoOriginal;
      }
    } catch (error) {
      console.error(error);
      btn.innerText = textoOriginal;
    } finally {
      btn.disabled = false;
    }
  }

  // --- UTILIDADES ---
  function actualizarTarjetaPerfil() {
    // 1. Recuperamos datos (Nombre y ID)
    const nombreUsuario = localStorage.getItem("user_name") || "Usuario";
    const userId = localStorage.getItem("user_id"); // <--- ¡ESTO FALTABA!

    // 2. Buscamos los elementos en el HTML
    const nombreDOM = document.getElementById("perfil-nombre");
    const avatarDOM = document.getElementById("perfil-avatar");
    // Buscamos el enlace dentro de la clase botones-perfil
    const linkPerfil = document.querySelector(".botones-perfil a");

    // 3. Actualizamos el Nombre
    if (nombreDOM) nombreDOM.textContent = nombreUsuario;

    // 4. Actualizamos el Avatar
    if (avatarDOM) {
      avatarDOM.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreUsuario)}&background=random&color=fff&size=128`;
    }

    // 5. 🔥 ACTUALIZAMOS EL ENLACE DEL BOTÓN
    if (linkPerfil && userId) {
      // Ahora el botón dirá algo como: perfil.html?id=9
      linkPerfil.href = `perfil.html?id=${userId}`;
    }
  }

  function mapearPost(postJava) {
    return {
      id: postJava.id,
      // Asegurar que tengamos el ID del autor
      authorId: postJava.authorId || postJava.userId || 0,
      usuario: postJava.authorName || "Anónimo",
      avatar: postJava.avatarUrl || "https://i.pravatar.cc/150?img=12",
      timestamp: new Date(postJava.createdAt).getTime(),
      contenido: postJava.content,
      imagen: postJava.imageUrl || null,
      likes: postJava.likes || 0,
      meGusta: false,
    };
  }

  // (Mantén aquí abajo tu lógica de "crearPostEnServidor" y el "modal" tal cual la tenías)
  if (btnAbrirModal && modal) {
    btnAbrirModal.addEventListener(
      "click",
      () => (modal.style.display = "flex"),
    );
    btnCerrarModal.addEventListener(
      "click",
      () => (modal.style.display = "none"),
    );
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const texto = document.getElementById("inputText").value;
      const inputFile = document.getElementById("inputImage");
      let imagenBase64 = null;
      if (inputFile.files[0])
        imagenBase64 = await leerImagen(inputFile.files[0]);
      await crearPostEnServidor(texto, imagenBase64);
    });
  }

  async function crearPostEnServidor(texto, imagenBase64) {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      Swal.fire("Error", "Debes iniciar sesión", "warning");
      return;
    }

    // Recuperamos el ID y lo enviamos como 'userId' (o 'authorId' según tu Java)
    const userId = localStorage.getItem("user_id");
    // 1. Recuperamos el ID del usuario logueado
    const miId = localStorage.getItem("user_id");
    // 2. Lo agregamos al objeto que se envía a Java
    const nuevoPost = {
      content: texto,
      imageUrl: imagenBase64,
      userId: miId, // <--- ¡ESTO ES LO QUE FALTABA!
    };
    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Publicando...";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPost),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Publicado!",
          showConfirmButton: false,
          timer: 1500,
        });
        form.reset();
        modal.style.display = "none";
        cargarPublicaciones();
      } else {
        Swal.fire("Error", "No se pudo publicar.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Fallo de conexión", "error");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = textoOriginal;
    }
  }

  function leerImagen(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
});
