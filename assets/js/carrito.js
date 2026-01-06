// CURSOS EN EL CARRITO
// ===== CARRITO DESDE LOCALSTORAGE =====
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===== ACTUALIZAR CONTADOR =====
function actualizarContador() {
  const contadorElemento = document.getElementById("contador");
  if (contadorElemento) {
    contadorElemento.textContent = carrito.length;
  }
}

// ===== AGREGAR AL CARRITO =====
function agregarAlCarrito(nombre, precio) {
  const curso = { nombre, precio };

  carrito.push(curso);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();

  alert(`💖 ${nombre} agregado al carrito`);
}

// ===== COMPRAR (SIMULACIÓN) =====
function comprar() {
  if (carrito.length === 0) {
    alert("Amiga, tu carrito está vacío 😭");
    return;
  }

  const total = carrito.reduce((acc, curso) => acc + curso.precio, 0);

  alert(
    `🛒 Compra exitosa ✨
Cursos: ${carrito.length}
Total: $${total}
(Simulación frontend 😌)`
  );

  carrito = [];
  localStorage.removeItem("carrito");
  actualizarContador();
}

// ===== AL CARGAR LA PÁGINA =====
actualizarContador();

