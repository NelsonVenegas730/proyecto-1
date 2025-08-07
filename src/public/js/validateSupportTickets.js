document.getElementById('formulario-tiquete').addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const title = document.getElementById('asunto').value.trim();
    const description = document.getElementById('descripcion').value.trim();
    const urgency_level = document.getElementById('urgencia').value;

    const successMessage = document.getElementById("mensaje-exito");
    const errorMessage = document.getElementById("mensaje-error");

    const asuntoMsg = document.getElementById('asunto-requisitos');
    const descripcionMsg = document.getElementById('descripcion-requisitos');
    const urgenciaMsg = document.getElementById('urgencia-requisitos');

    successMessage.classList.add("oculto");
    errorMessage.classList.add("oculto");

    let hasError = false;

    if (title.length === 0 || title.length > 100 || !/^[a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ\s.,()!?¿¡-]+$/.test(title)) {
      asuntoMsg.textContent = 'Título inválido.';
      hasError = true;
    } else {
      asuntoMsg.textContent = '';
    }

    if (!description) {
      descripcionMsg.textContent = 'Descripción requerida.';
      hasError = true;
    } else {
      descripcionMsg.textContent = '';
    }

    if (!urgency_level) {
      urgenciaMsg.textContent = 'Selecciona urgencia.';
      hasError = true;
    } else {
      urgenciaMsg.textContent = '';
    }

    if (hasError) {
      console.log("Validación falló");
      return;
    }

    const response = await fetch('/api/support-tickets/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        urgency_level,
      })
    });

    if (response.ok) {
      successMessage.classList.remove("oculto");
      errorMessage.classList.add("oculto");

      setTimeout(() => {
        window.location.href = '/sugerencias';
      }, 500);
    } else {
      const err = await response.json();
      errorMessage.textContent = err?.error || "Error desconocido";
      errorMessage.classList.remove("oculto");
      successMessage.classList.add("oculto");
    }
  } catch (err) {
    console.error("Error fatal:", err);
    alert("Error inesperado. Revisa consola.");
  }
});