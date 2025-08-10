function customConfirm(message) {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-confirm');
    const msgElem = document.getElementById('confirm-message');
    const btnYes = document.getElementById('confirm-yes');
    const btnNo = document.getElementById('confirm-no');

    msgElem.textContent = message;
    modal.classList.remove('hidden');

    const cleanup = () => {
      btnYes.removeEventListener('click', onYes);
      btnNo.removeEventListener('click', onNo);
      modal.classList.add('hidden');
    };

    const onYes = () => {
      cleanup();
      resolve(true);
    };

    const onNo = () => {
      cleanup();
      resolve(false);
    };

    btnYes.addEventListener('click', onYes);
    btnNo.addEventListener('click', onNo);
  });
}

document.querySelectorAll('.delete-user-btn').forEach(btn => {
  btn.addEventListener('click', async e => {
    e.preventDefault();

    const row = btn.closest('tr');
    if (!row) return;

    const userId = row.getAttribute('data-user-id');
    if (!userId) {
      alert('No se encontró ID de usuario');
      return;
    }

    const confirmado = await customConfirm('¿Seguro quieres eliminar este usuario?');
    if (!confirmado) return;

    try {
      const res = await fetch(`/auth/admin/delete-user/${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar usuario');

      row.remove();

      const mensajeExito = document.getElementById('mensaje-exito');
      mensajeExito.textContent = 'Usuario eliminado con éxito';
      mensajeExito.classList.remove('oculto');
      setTimeout(() => {
        mensajeExito.classList.add('oculto');
        location.reload();
      }, 3000);
    } catch (error) {
      const mensajeError = document.getElementById('mensaje-error');
      mensajeError.textContent = error.message;
      mensajeError.classList.remove('oculto');
      setTimeout(() => {
        mensajeError.classList.add('oculto');
      }, 3000);
    }
  });
});
