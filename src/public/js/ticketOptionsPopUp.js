document.addEventListener('DOMContentLoaded', () => {
  const alertBox = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const alertOk = document.getElementById('alert-ok');

  const confirmBox = document.getElementById('custom-confirm');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');

  function showAlert(msg) {
    alertMessage.textContent = msg;
    alertBox.classList.remove('hidden');
    return new Promise(resolve => {
      alertOk.onclick = () => {
        alertBox.classList.add('hidden');
        resolve();
      };
    });
  }

  function showConfirm(msg) {
    confirmMessage.textContent = msg;
    confirmBox.classList.remove('hidden');
    return new Promise(resolve => {
      confirmYes.onclick = () => {
        confirmBox.classList.add('hidden');
        resolve(true);
      };
      confirmNo.onclick = () => {
        confirmBox.classList.add('hidden');
        resolve(false);
      };
    });
  }

  document.addEventListener('click', async e => {
    const popupBtn = e.target.closest('.ticket-menu-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (popupBtn) {
      e.stopPropagation();
      const popup = popupBtn.nextElementSibling;
      document.querySelectorAll('.ticket-menu-popup.show').forEach(p => {
        if (p !== popup) p.classList.remove('show');
      });
      popup.classList.toggle('show');
      return;
    } else {
      document.querySelectorAll('.ticket-menu-popup.show').forEach(p => p.classList.remove('show'));
    }

    if (deleteBtn) {
      e.stopPropagation();

      const ticketElement = deleteBtn.closest('.ticket-element');
      const ticketId = ticketElement?.dataset.ticketId;
      if (!ticketId) return;

      const confirmed = await showConfirm('¿Estás seguro de que querés eliminar este tiquete?');
      if (!confirmed) return;

      try {
        const res = await fetch(`/api/support-tickets/${ticketId}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error();

        ticketElement.remove();
      } catch (err) {
        await showAlert('No se pudo eliminar el tiquete');
        console.error(err);
      }
    }
  });
});
