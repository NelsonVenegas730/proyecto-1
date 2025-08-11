document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.announcement-menu-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const popup = btn.nextElementSibling
      if (!popup) return

      document.querySelectorAll('.announcement-menu-popup.show').forEach(p => {
        if (p !== popup) p.classList.remove('show')
      })

      popup.classList.toggle('show')
    })
  })

  document.addEventListener('click', () => {
    document.querySelectorAll('.announcement-menu-popup.show').forEach(popup => {
      popup.classList.remove('show')
    })
  })

  document.querySelectorAll('.announcement-menu-option').forEach(option => {
    option.addEventListener('click', () => {
      const popup = option.closest('.announcement-menu-popup')
      if (popup) popup.classList.remove('show')
    })
  })
})

const customConfirm = document.getElementById('custom-confirm');
const confirmMessage = document.getElementById('confirm-message');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

document.querySelectorAll('.announcement-menu-option.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.noticia-evento-anuncio-element');
    if (!card) return;

    const id = card.dataset.id;
    if (!id) {
      alert('No se encontró el ID del anuncio');
      return;
    }

    confirmMessage.textContent = '¿Estás seguro que quieres eliminar este anuncio?';
    customConfirm.classList.remove('hidden');

    confirmNo.onclick = () => {
      customConfirm.classList.add('hidden');
    };

    confirmYes.onclick = async () => {
      try {
        const res = await fetch(`/api/announcement/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error eliminando anuncio');
        customConfirm.classList.add('hidden');
        // Podés mostrar mensaje de éxito o recargar
        location.reload();
      } catch (error) {
        customConfirm.classList.add('hidden');
        alert(error.message);
      }
    };
  });
});