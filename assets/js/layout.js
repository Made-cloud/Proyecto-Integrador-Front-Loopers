// =======================================
// LAYOUT GLOBAL (NAVBAR + FOOTER)
// =======================================

// Detectar ruta actual
const path = window.location.pathname;

// Si estamos en /pages/ usamos ../
// Si estamos en la raíz usamos ./
const basePath = path.includes("/pages/") ? "../" : "./";

// =======================================
// CARGAR NAVBAR
// =======================================

fetch(basePath + "components/navbar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el navbar");
    }
    return response.text();
  })
  .then(html => {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    navbarContainer.innerHTML = html;

    // 👉 AVISAR QUE EL NAVBAR YA ESTÁ LISTO
    document.dispatchEvent(new Event("navbarLoaded"));
  })
  .catch(error => console.error(error));

// =======================================
// CARGAR FOOTER
// =======================================

fetch(basePath + "components/footer.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el footer");
    }
    return response.text();
  })
  .then(html => {
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) return;

    footerContainer.innerHTML = html;
  })
  .catch(error => console.error(error));
