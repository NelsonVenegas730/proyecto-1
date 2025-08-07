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
    const editBtn = e.target.closest('.edit-btn');

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

    if (editBtn) {
      e.stopPropagation();
      const ticketElement = editBtn.closest('.ticket-element');
      const ticketInfo = ticketElement.querySelector('.ticket-info');

      const inputTitle = ticketInfo.querySelector('input[name="title"]');
      const inputDesc = ticketInfo.querySelector('textarea[name="description"]');

      inputTitle.dataset.originalValue = inputTitle.value;
      inputDesc.dataset.originalValue = inputDesc.value;

      ticketInfo.querySelectorAll('.view-mode').forEach(el => el.classList.add('hidden-input'));
      ticketInfo.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('hidden-input'));

      ticketInfo.querySelectorAll('.save-btn, .cancel-btn').forEach(btn => btn.classList.remove('hidden-input'));

      editBtn.closest('.ticket-menu-popup').classList.remove('show');
    }

    const cancelBtn = e.target.closest('.cancel-btn');
    const saveBtn = e.target.closest('.save-btn');

    if (cancelBtn) {
      e.stopPropagation();
      const ticketElement = cancelBtn.closest('.ticket-element');
      const ticketInfo = ticketElement.querySelector('.ticket-info');

      const inputTitle = ticketInfo.querySelector('input[name="title"]');
      const inputDesc = ticketInfo.querySelector('textarea[name="description"]');

      inputTitle.value = inputTitle.dataset.originalValue || '';
      inputDesc.value = inputDesc.dataset.originalValue || '';

      ticketInfo.querySelectorAll('.view-mode').forEach(el => el.classList.remove('hidden-input'));
      ticketInfo.querySelectorAll('.edit-mode').forEach(el => el.classList.add('hidden-input'));
      ticketInfo.querySelectorAll('.save-btn, .cancel-btn').forEach(btn => btn.classList.add('hidden-input'));
    }

    if (saveBtn) {
      e.stopPropagation();
      const ticketElement = saveBtn.closest('.ticket-element');
      const ticketInfo = ticketElement.querySelector('.ticket-info');
      const ticketId = ticketElement?.dataset.ticketId;

      if (!ticketId) return;

      const inputTitle = ticketInfo.querySelector('input[name="title"]');
      const inputDesc = ticketInfo.querySelector('textarea[name="description"]');

      const newTitle = inputTitle.value.trim();
      const newDesc = inputDesc.value.trim();

      if (!newTitle || !newDesc) {
        alert('Título y descripción no pueden estar vacíos');
        return;
      }

      try {
        const res = await fetch(`/api/support-tickets/${ticketId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, description: newDesc })
        });

        if (!res.ok) throw new Error();

        const titleEl = ticketInfo.querySelector('h3.view-mode');
        const descEl = ticketInfo.querySelector('p.view-mode');

        if (titleEl) titleEl.textContent = newTitle;
        if (descEl) descEl.textContent = newDesc;

        ticketInfo.querySelectorAll('.view-mode').forEach(el => el.classList.remove('hidden-input'));
        ticketInfo.querySelectorAll('.edit-mode').forEach(el => el.classList.add('hidden-input'));
        ticketInfo.querySelectorAll('.save-btn, .cancel-btn').forEach(btn => btn.classList.add('hidden-input'));
      } catch (err) {
        alert('No se pudo actualizar el tiquete');
        console.error(err);
      }
    }
  });
});
