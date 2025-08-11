function mostrarMensaje(tipo, texto) {
  const mensajeExito = document.getElementById('mensaje-exito');
  const mensajeError = document.getElementById('mensaje-error');

  if (tipo === 'exito') {
    mensajeError.classList.add('oculto');
    mensajeExito.textContent = texto;
    mensajeExito.classList.remove('oculto');
    setTimeout(() => {
      mensajeExito.classList.add('oculto');
    }, 3000);
  } else if (tipo === 'error') {
    mensajeExito.classList.add('oculto');
    mensajeError.textContent = texto;
    mensajeError.classList.remove('oculto');
    setTimeout(() => {
      mensajeError.classList.add('oculto');
    }, 3000);
  }
}

document.querySelectorAll('.announcement-menu-option.edit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.noticia-evento-anuncio-element');
    if (!card) return;

    const titleText = card.querySelector('h3');
    const descText = card.querySelector('p');
    const image = card.querySelector('img');

    const titleInput = card.querySelector('input[name="title"]');
    const descInput = card.querySelector('textarea[name="description"]');
    const guardarBtn = card.querySelector('.guardar-cambios-btn');
    const cancelarBtn = card.querySelector('.cancelar-cambios-btn');

    if (titleText) titleText.style.display = 'none';
    if (descText) descText.style.display = 'none';
    if (image) image.style.display = 'none';

    if (titleInput) titleInput.classList.remove('oculto');
    if (descInput) descInput.classList.remove('oculto');
    if (guardarBtn) guardarBtn.classList.remove('oculto');
    if (cancelarBtn) cancelarBtn.classList.remove('oculto');

    let fileInput = card.querySelector('input[type="file"].image-input');
    let previewImg = card.querySelector('.image-preview');

    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.classList.add('image-input', 'announcement-edit-input');
      fileInput.style.marginTop = '10px';

      previewImg = document.createElement('img');
      previewImg.classList.add('image-preview');
      previewImg.style.maxWidth = '100%';
      previewImg.style.marginTop = '10px';
      previewImg.style.display = 'none';

      image.parentNode.insertBefore(fileInput, image.nextSibling);
      image.parentNode.insertBefore(previewImg, fileInput.nextSibling);

      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) {
          previewImg.src = '';
          previewImg.style.display = 'none';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
    }

    fileInput.classList.remove('oculto');
    previewImg.style.display = 'none';

    cancelarBtn.onclick = () => location.reload();

    guardarBtn.onclick = async () => {
      if (!titleInput.value.trim()) {
        mostrarMensaje('error', 'El título no puede estar vacío');
        return;
      }
      if (!descInput.value.trim()) {
        mostrarMensaje('error', 'La descripción no puede estar vacía');
        return;
      }

      const id = card.dataset.id;
      if (!id) {
        mostrarMensaje('error', 'Error: no se encontró el ID del anuncio.');
        return;
      }

      const formData = new FormData();
      formData.append('title', titleInput.value.trim());
      formData.append('description', descInput.value.trim());

      if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }

      try {
        const res = await fetch(`/api/announcement/${id}`, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) throw new Error('Error actualizando anuncio');
        mostrarMensaje('exito', 'Anuncio actualizado con éxito');
        setTimeout(() => location.reload(), 3100);
      } catch (error) {
        mostrarMensaje('error', error.message);
      }
    };
  });
});
