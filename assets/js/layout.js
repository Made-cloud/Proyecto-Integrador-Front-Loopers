const path = window.location.pathname;

// 1. Definir si estamos dentro de la carpeta pages
// Si la URL tiene "/pages/", tenemos que salir un nivel (../)
// Si no, estamos en la raíz (./)
const basePath = path.includes("/pages/") ? "../" : "./";

// 2. Cargar el Navbar
// Nota: Ya NO ponemos "assets/" porque la carpeta components está en la raíz
fetch(basePath + 'components/navbar.html')
    .then(response => {
        if (!response.ok) throw new Error("No se encontró el navbar");
        return response.text();
    })
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    });
