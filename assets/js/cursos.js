const cursos = [
  {
    titulo: "Normas para exportar",
    descripcion: "Aprende a exportar en pasos simples con guías claras y aplicables.",
    precio: 50000,
    imagen: "../assets/images/exportacion.jpg"
  },
  {
    titulo: "Certificaciones",
    descripcion: "Conoce las certificaciones necesarias para exportar tus productos a nuevos mercados.",
    precio: 45000,
    imagen: "../assets/images/certificaciones.jpg"
  },
  {
    titulo: "Marketing digital",
    descripcion: "Estrategias para posicionar tu marca en mercados globales.",
    precio: 35000,
    imagen: "../assets/images/marketing.png"
  }
];

const contenedor = document.getElementById("catalogo-cursos-js");

cursos.forEach(curso => {
  const card = document.createElement("article");
  card.classList.add("card", "curso-card");

  card.innerHTML = `
    <img src="${curso.imagen}" class="card__image" alt="${curso.titulo}">
    <div class="card__body">
      <h3 class="card__title">${curso.titulo}</h3>
      <p class="card__description">${curso.descripcion}</p>
      <p class="card__price">$${curso.precio.toLocaleString("es-CL")}</p>
      <button 
        class="btn btn-primary agregar-carrito"
        data-nombre="${curso.titulo}"
        data-precio="${curso.precio}">
        Agregar al carrito
      </button>
    </div>
  `;

  contenedor.appendChild(card);
});
