// =======================================
// CARRITO DE CURSOS - FRONTEND ONLY
// FUNCIONA CON NAVBAR DINÁMICO (FETCH)
// =======================================

// ---------- ESTADO GLOBAL ----------
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ---------- SELECTORES (DINÁMICOS) ----------
let contador = null;
const contenedorCarrito = document.querySelector(".empty-cart");
const resumenCompra = document.querySelector(".summary");

// =======================================
// UTILIDADES
// =======================================

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  renderizarCarrito();
  renderizarResumen();
}

function actualizarContador() {
  // Volvemos a buscar el contador porque el navbar es dinámico
  contador = document.getElementById("contador");

  if (contador) {
    contador.textContent = carrito.length;

    // Opcional: ocultar si está en 0
    contador.style.display = carrito.length > 0 ? "flex" : "none";
  }
}

function obtenerTotal() {
  return carrito.reduce((total, curso) => total + curso.precio, 0);
}

// =======================================
// AGREGAR CURSO
// =======================================

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  guardarCarrito();

  alert(`💖 "${nombre}" agregado al carrito`);
}

// =======================================
// ELIMINAR CURSO
// =======================================

function eliminarCurso(index) {
  carrito.splice(index, 1);
  guardarCarrito();
}

// =======================================
// RENDERIZAR CARRITO
// =======================================

function renderizarCarrito() {
  if (!contenedorCarrito) return;

  // CARRITO VACÍO
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
      <h4 class="mb-3">Tu carrito está vacío 🛒</h4>
      <p class="text-muted">
        Aún no has agregado cursos a tu carrito.
      </p>
      <a href="../pages/cursos.html" class="btn btn-primary mt-3">
        Explorar cursos
      </a>
    `;
    return;
  }

  // CARRITO CON PRODUCTOS
  contenedorCarrito.innerHTML = `
    <h4 class="mb-4 text-start">Tus cursos</h4>

    <ul class="list-group">
      ${carrito
        .map(
          (curso, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${curso.nombre}</strong><br>
            <span class="text-muted">$${curso.precio.toLocaleString("es-CL")}</span>
          </div>

          <button class="btn btn-sm btn-danger" onclick="eliminarCurso(${index})">
            ❌
          </button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

// =======================================
// RENDERIZAR RESUMEN
// =======================================

function renderizarResumen() {
  if (!resumenCompra) return;

  if (carrito.length === 0) {
    resumenCompra.innerHTML = `
      <h5 class="mb-3">Resumen de la compra</h5>

      <div class="d-flex justify-content-between mb-2">
        <span>Productos (0)</span>
        <span>$0</span>
      </div>

      <div class="d-flex justify-content-between mb-3">
        <span>Descuentos</span>
        <span>$0</span>
      </div>

      <hr>

      <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
        <span>Total</span>
        <span>$0</span>
      </div>

      <button class="btn btn-secondary w-100" disabled>
        Continuar compra
      </button>
    `;
    return;
  }

  const total = obtenerTotal();

  resumenCompra.innerHTML = `
    <h5 class="mb-3">Resumen de la compra</h5>

    <div class="d-flex justify-content-between mb-2">
      <span>Productos (${carrito.length})</span>
      <span>$${total.toLocaleString("es-CL")}</span>
    </div>

    <div class="d-flex justify-content-between mb-3">
      <span>Descuentos</span>
      <span>$0</span>
    </div>

    <hr>

    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Total</span>
      <span>$${total.toLocaleString("es-CL")}</span>
    </div>

    <button class="btn btn-primary w-100" onclick="comprar()">
      Comprar
    </button>
  `;
}

// =======================================
// COMPRAR (SIMULACIÓN)
// =======================================

function comprar() {
  if (carrito.length === 0) return;

  const total = obtenerTotal();

  alert(
    `🛒 Compra realizada ✨\n\n` +
    `Cursos: ${carrito.length}\n` +
    `Total: $${total.toLocaleString("es-CL")}\n\n` +
    `(Simulación frontend)`
  );

  carrito = [];
  localStorage.removeItem("carrito");
  guardarCarrito();
}

// =======================================
// INICIALIZACIÓN
// =======================================

// DOM listo
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  renderizarCarrito();
  renderizarResumen();
});

// Navbar cargado por fetch
document.addEventListener("navbarLoaded", () => {
  actualizarContador();
});
