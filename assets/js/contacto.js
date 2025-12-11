// ========= FORMATEO DEL TELÉFONO =========
const phoneInput = document.getElementById('inputPhone');

if (phoneInput) {
  phoneInput.addEventListener('input', function (event) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 0 && value[0] !== '9') {
      value = '9' + value;
    }

    if (value.length > 1) {
      value = value.substring(0, 1) + ' ' + value.substring(1);
    }

    if (value.length > 6) {
      value = value.substring(0, 6) + ' ' + value.substring(6);
    }

    event.target.value = value;
  });
}

// ========= VALIDACIÓN + ENVÍO A FORMSPREE =========
const contactformm = document.getElementById('contactForm');

if (contactformm) {
  contactformm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('inputName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();
    const message = document.getElementById('inputMessage').value.trim();

    // Validación
    if (!name || !email || !message) {
      alert("Por favor completa los campos obligatorios (Nombre, Correo, Mensaje).");
      return;
    }

    // Crear datos a enviar
    const formData = new FormData(contactformm);

    try {
      const response = await fetch("https://formspree.io/f/mzznkgko", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        alert("¡Gracias! Su mensaje ha sido enviado exitosamente.");
        contactformm.reset();
      } else {
        alert("Hubo un problema al enviar el formulario. Intente nuevamente.");
      }
    } catch (error) {
      alert("Error de conexión al enviar el formulario. Por favor intente más tarde.");
    }
  });
}
