let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
actualizarContador();

function agregarAlCarrito(nombre, precio) {
  const curso = {
    nombre,
    precio
  };

  carrito.push(curso);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  document.getElementById("contador").textContent = carrito.length;
}
