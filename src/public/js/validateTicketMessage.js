document.querySelectorAll('.reply-form').forEach(form => {
  const ticketElement = form.closest('.ticket-element');
  const ticketId = ticketElement?.getAttribute('data-id') || ticketElement?.dataset?.id || ticketElement?.getAttribute('data-ticket-id') || ticketElement?.dataset?.ticketId || ticketElement?.getAttribute('data-user-id');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const textarea = form.querySelector('textarea');
    const message = textarea.value.trim();

    if (message.length === 0) {
      alert('El mensaje no puede estar vacío.');
      return;
    }

    const res = await fetch(`/api/support-tickets/${ticketId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (res.ok) {
      window.location.reload();
    } else {
      const err = await res.json();
      alert(`Error al enviar mensaje: ${err.error}`);
    }
  });

  form.querySelector('.btn-cancel').addEventListener('click', () => {
    form.style.display = 'none';
    form.querySelector('textarea').value = '';
  });
});

document.querySelectorAll('.btn-reply-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const ticket = button.closest('.ticket-element');
    const form = ticket.querySelector('.reply-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
});