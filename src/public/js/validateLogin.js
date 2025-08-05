const form = document.getElementById('formulario');
const mensajeExito = document.getElementById('mensaje-exito');
const mensajeError = document.getElementById('mensaje-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  mensajeError.textContent = '';
  mensajeError.classList.add('oculto');
  mensajeExito.textContent = '';
  mensajeExito.classList.add('oculto');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      mensajeError.textContent = result.message || 'Error desconocido';
      mensajeError.classList.remove('oculto');

      setTimeout(() => {
        mensajeError.classList.add('oculto');
      }, 4000);
    } else {
      mensajeExito.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
      mensajeExito.classList.remove('oculto');

      setTimeout(() => {
        mensajeExito.classList.add('oculto');
        const role = result.role;
        const id = result.userId;
        if (role === 'administrador') {
          window.location.href = '/admin/panel-administrador';
        } else if (role === 'emprendedor') {
          window.location.href = `/emprendedor/mi-emprendimiento/${id}`;
        } else {
          window.location.href = '/';
        }
      }, 2000);
    }
  } catch (err) {
    mensajeError.textContent = 'Error al procesar la solicitud.';
    mensajeError.classList.remove('oculto');

    setTimeout(() => {
      mensajeError.classList.add('oculto');
    }, 4000);
  }
});
