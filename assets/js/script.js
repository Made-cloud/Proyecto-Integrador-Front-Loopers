/* =============================
   EXPORTIFY - SCRIPT PRINCIPAL
   Funcionalidad de catálogo,
   login, publicar productos y
   comentarios entre usuarias.
============================= */

console.log("Exportify cargado✔");

/* ----------------------
   1. LOGIN SIMPLIFICADO
---------------------- */
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", () => {
  alert("Login simulado: futura integración con registro y cuentas de emprendedoras.");
});


/* ----------------------
   2. CATÁLOGO INICIAL
---------------------- */
const productList = document.getElementById("productList");

let productos = [
  {
    nombre: "Cartera artesanal",
    precio: 45,
    descripcion: "Hecha a mano por emprendedora chilena.",
  },
  {
    nombre: "Aritos de cobre",
    precio: 20,
    descripcion: "Accesorios inspirados en la minería chilena.",
  },
];

function mostrarCatalogo() {
  productList.innerHTML = "";
  productos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <strong>USD $${p.precio}</strong>
    `;
    productList.appendChild(card);
  });
}

mostrarCatalogo();

/* ----------------------
   3. PUBLICAR PRODUCTOS
---------------------- */
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcionProducto").value;

  productos.push({ nombre, precio, descripcion });
  mostrarCatalogo();

  productForm.reset();
  alert("Producto publicado con éxito 🎉");
});

/* ----------------------
   4. COMENTARIOS ENTRE USUARIAS
---------------------- */
const comentariosDiv = document.getElementById("comentarios");
const enviarComentario = document.getElementById("enviarComentario");
const nuevoComentario = document.getElementById("nuevoComentario");

let comentarios = [];

function renderComentarios() {
  comentariosDiv.innerHTML = "";
  comentarios.forEach((c) => {
    const caja = document.createElement("p");
    caja.textContent = `• ${c}`;
    comentariosDiv.appendChild(caja);
  });
}

enviarComentario.addEventListener("click", () => {
  if (nuevoComentario.value.trim() === "") return alert("Escribe un comentario, comadre 💅");

  comentarios.push(nuevoComentario.value);
  nuevoComentario.value = "";
  renderComentarios();
});

/* ----------------------
   5. BOTÓN 'VER CATÁLOGO'
---------------------- */
const verCatalogoBtn = document.getElementById("verCatalogoBtn");
verCatalogoBtn.addEventListener("click", () => {
  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
});
