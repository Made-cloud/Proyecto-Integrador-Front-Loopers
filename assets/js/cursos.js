const cursos = [
  {
    titulo: "Gestión técnica del proceso de exportación",
    descripcion: "Curso orientado a comprender y ejecutar el flujo completo de una operación de exportación, desde la preparación del producto hasta la salida legal de la mercancía desde Chile, bajo normativa vigente.",
    precio: 50000,
    imagen: "../assets/images/exportacion.jpg"
  },
  {
    titulo: "Certificaciones",
    descripcion: "Análisis de las certificaciones obligatorias y voluntarias requeridas para exportar desde Chile, según tipo de producto y mercado de destino, considerando normativa sanitaria, fitosanitaria y de calidad.",
    precio: 45000,
    imagen: "../assets/images/certificaciones.jpg"
  },
  {
    titulo: "Marketing digital",
    descripcion: "Curso enfocado en la estrategia comercial internacional, considerando análisis de mercado, fijación de precios de exportación y posicionamiento digital para mercados externos.",
    precio: 35000,
    imagen: "../assets/images/marketing.png"
  },
  {
    titulo: "Normativa aduanera y tributaria chilena aplicada a la exportación",
    descripcion: "Estudio detallado de la legislación chilena aplicable a la exportación, con énfasis en cumplimiento tributario, aduanero y documental ante el SII y el Servicio Nacional de Aduanas.",
    precio: 55000,
    imagen: "../assets/images/normativa.jpg"
  },
  {
    titulo: "Documentación y logística internacional de exportación",
    descripcion: "Curso orientado a la gestión documental y logística de exportaciones, considerando medios de transporte, contratos y coordinación con operadores logísticos.",
    precio: 48000,
    imagen: "../assets/images/logistica.jpg"
  },
  {
    titulo: "Tratados de Libre Comercio y reglas de origen",
    descripcion: "Análisis técnico de los TLC vigentes de Chile, con énfasis en reglas de origen, certificación y beneficios arancelarios aplicables a la exportación.",
    precio: 42000,
    imagen: "../assets/images/financiamiento.jpg"
  }
  

];
function agregarAlCarrito(titulo, precio) {
 alert(`Curso "${titulo}" agregado al carrito por $${precio.toLocaleString("es-CL")}`); 
 

  
}

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
      <button onclick="agregarAlCarrito('${curso.titulo}', ${curso.precio})" class="btn btn-primary agregar-carrito" data-titulo="${curso.titulo}" data-precio="${curso.precio}">Agregar al carrito</button>
    </div>
  `;

  contenedor.appendChild(card);
});
