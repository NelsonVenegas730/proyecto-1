document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-anuncio');
  const tipo = document.getElementById('tipo');
  const titulo = document.getElementById('titulo');
  const descripcion = document.getElementById('descripcion');
  const imagen = document.getElementById('imagen');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errores = [];

    if (!tipo.value) errores.push('Debes seleccionar un tipo de publicación');
    if (!titulo.value.trim()) errores.push('El título es obligatorio');
    if (titulo.value.trim().length > 100) errores.push('El título es muy largo');
    if (!descripcion.value.trim() || descripcion.value.trim().length < 10) errores.push('La descripción debe tener al menos 20 caracteres');

    if (errores.length > 0) {
      alert(errores.join('\n'));
      return;
    }

    const formData = new FormData();
    formData.append('type', tipo.value);
    formData.append('title', titulo.value.trim());
    formData.append('description', descripcion.value.trim());
    if (imagen.files.length > 0) {
      formData.append('image', imagen.files[0]);
    }

    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('Anuncio creado correctamente');
        window.location.href = '/noticias-anuncios-eventos';
      } else {
        alert(data.message || 'Error al crear el anuncio');
      }
    } catch (err) {
      console.error(err);
      alert('Error inesperado al enviar el formulario');
    }
  });
});
