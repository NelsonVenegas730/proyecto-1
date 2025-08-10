const selects = document.querySelectorAll('.ticket-status-select');

selects.forEach(select => {
  let prevValue = select.value;

  select.addEventListener('change', async e => {
    const newStatus = e.target.value;
    if (newStatus === prevValue) return;

    const ticketElement = e.target.closest('.ticket-element');
    const ticketId = ticketElement?.dataset.ticketId || ticketElement?.getAttribute('data-ticket-id');

    if (!ticketId) {
      console.error('No se encontró ticketId');
      e.target.value = prevValue;
      return;
    }

    try {
      const res = await fetch(`/api/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Error actualizando status');

      ['abierto', 'en-proceso', 'cerrado'].forEach(cls => select.classList.remove(cls));
      select.classList.add(newStatus.replace(' ', '-').toLowerCase());

      prevValue = newStatus;
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el estado. Intenta de nuevo.');
      e.target.value = prevValue;
    }
  });
});