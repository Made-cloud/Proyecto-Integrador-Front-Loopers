const newsData = [
  {
    id: 1,
    title: "Exportify lanza nueva plataforma de e-commerce para emprendedores",
    excerpt: "La nueva versión de nuestra plataforma incluye herramientas avanzadas de gestión de inventario y análisis de ventas internacionales.",
    category: "exportify",
    date: "2025-12-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
    url: "https://www.google.com/"
  },    
  {
    id: 2,
    title: "Cursos Sercotec 2026: Prepárate para formalizar tu negocio",
    excerpt: "Descubre las principales tendencias que marcarán el comercio global el próximo año y cómo preparar tu negocio.",
    category: "comercio",
    date: "2025-12-08",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    url:"https://www.sercotec.cl/"
  },
  {
    id: 3,
    title: "Inteligencia artificial para emprendedores: Curso gratuito",
    excerpt: "Es un Curso GRATUITO que ayuda a los emprendedores a utilizar IA para mejorar la logística y reducir costos en exportaciones.",
    category: "tecnologia",
    date: "2025-12-05",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    url: "https://iaparaemprendedores.com/"
  },
  {
    id: 4,
    title: "Caso de éxito: Artesanos locales conquistan mercados europeos",
    excerpt: "Conoce la historia de cómo un grupo de artesanos logró expandir su negocio a 12 países usando Exportify.",
    category: "exportify",
    date: "2025-12-03",
    readTime: "7 min",
    image: "https://artesaniasdecolombia.com.co/Documentos/Contenido/38319_especial-mopa-mopa-4-1-artesanias-colombia-2021-g.jpg",
    url: "https://www.google.com/"
  },
  {
    id: 5,
    title: "Chile recibe delegación potenciar la industria nacional  ",
    excerpt: "Los recientes tratados de libre comercio abren oportunidades para que más negocios accedan a mercados internacionales.",
    category: "comercio",
    date: "2025-12-10",
    readTime: "4 min",
    image: "https://www.prochile.gob.cl/images/default-source/actividades/fam-trip-2025.jpeg?sfvrsn=e8a6d505_1",
    url: "https://www.prochile.gob.cl/noticias/detalle-noticia/2025/12/10/chile-delegaci%C3%B3n-internacional-fam-trip-2025-norte-sur-film-commision"
  },
  {
    id: 6,
    title: "Blockchain en el comercio: trazabilidad y transparencia",
    excerpt: "La tecnología blockchain está mejorando la confianza en las transacciones internacionales con mayor trazabilidad.",
    category: "tecnologia",
    date: "2025-11-28",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    url: "https://www.bbva.com/es/innovacion/blockchain-comercio-internacional-trazabilidad-transparencia/"
  }
];

// Additional news for "load more"
const additionalNews = [
  {
    id: 7,
    title: "Exportify anuncia aplicación móvil para sus cursos",
    excerpt: "Ahora podrás acceder a todos los cursos de Exportify desde tu smartphone, facilitando el aprendizaje en cualquier lugar.",
    category: "exportify",
    date: "2025-11-25",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    url: "https://www.google.com/"
  },
  {
    id: 8,
    title: "El futuro del packaging sustentable en exportaciones",
    excerpt: "Las nuevas regulaciones ambientales están impulsando innovaciones en empaques ecológicos para comercio internacional.",
    category: "comercio",
    date: "2025-11-22",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
    url: "https://www.packagingeurope.com/the-future-of-sustainable-packaging-in-international-trade/"
  },
  {
    id: 9,
    title: "Automatización de aduanas: menos tiempo, más eficiencia",
    excerpt: "Nuevos sistemas digitales están reduciendo drásticamente los tiempos de procesamiento en aduanas.",
    category: "tecnologia",
    date: "2025-11-20",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=400&fit=crop",
    url: "https://www.logisticsmgmt.com/article/automation_in_customs_streamlining_processes_for_international_trade"
  }
];

// State
let currentFilter = 'all';
let newsLoaded = false;

// DOM Elements
const newsGrid = document.getElementById('newsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterButtons = document.querySelectorAll('.filter-btn');

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Create news card HTML
function createNewsCard(news) {
  return `
    <article class="news-card" data-category="${news.category}">
      <img 
        src="${news.image}" 
        alt="${news.title}" 
        class="news-card-image"
        loading="lazy"
      />
      <div class="news-card-content">
        <span class="news-card-category ${news.category}">${news.category}</span>
        <h2 class="news-card-title">${news.title}</h2>
        <p class="news-card-excerpt">${news.excerpt}</p>
        <div class="news-card-meta">
          <span class="news-card-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${formatDate(news.date)}
          </span>
          <span class="news-card-read-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${news.readTime}
          </span>
        </div>
        <a href="${news.url}" class="news-card-link">
          Leer más
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </article>
  `;
}

// Render news
function renderNews(news, append = false) {
  const filteredNews = currentFilter === 'all' 
    ? news 
    : news.filter(item => item.category === currentFilter);

  if (append) {
    newsGrid.innerHTML += filteredNews.map(createNewsCard).join('');
  } else {
    newsGrid.innerHTML = filteredNews.map(createNewsCard).join('');
  }
}

// Filter news
function filterNews(filter) {
  currentFilter = filter;
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  // Re-render with current data
  const allNews = newsLoaded ? [...newsData, ...additionalNews] : newsData;
  renderNews(allNews);
}

// Load more news
function loadMoreNews() {
  if (!newsLoaded) {
    renderNews(additionalNews, true);
    newsLoaded = true;
    loadMoreBtn.textContent = 'No hay más noticias';
    loadMoreBtn.disabled = true;
  }
}

// Event listeners
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => filterNews(btn.dataset.filter));
});

loadMoreBtn.addEventListener('click', loadMoreNews);

// Initial render
renderNews(newsData);