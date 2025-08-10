document.querySelectorAll('.reply-form').forEach(form => {
  const ticketElement = form.closest('.ticket-element');
  const ticketId = ticketElement?.getAttribute('data-id') || ticketElement?.dataset?.id || ticketElement?.getAttribute('data-ticket-id') || ticketElement?.dataset?.ticketId || ticketElement?.getAttribute('data-user-id');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const textarea = form.querySelector('textarea');
    const message = textarea.value.trim();
    if (!message) return alert('El mensaje no puede estar vacío.');

    const res = await fetch(`/api/support-tickets/${ticketId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (res.ok) {
      const updatedTicket = await res.json();

      const messageThread = ticketElement.querySelector('.message-thread');

      // Si no hay mensajes todavía, crear el contenedor
      if (!messageThread) {
        const newThread = document.createElement('div');
        newThread.classList.add('message-thread');
        ticketElement.querySelector('.ticket-info').appendChild(newThread);
      }

      // Actualizar los mensajes (ejemplo, simplificado: borrás todo y renderizás)
      const thread = ticketElement.querySelector('.message-thread');
      thread.innerHTML = ''; // vaciás

      updatedTicket.messages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(msg.sender_role?.toLowerCase() === 'administrador' ? 'admin-message' : 'user-message');

        div.innerHTML = `
          <div class="message-content">${msg.message}</div>
          <span class="message-meta">
            ${msg.sender_role?.toLowerCase() === 'administrador'
              ? 'Admin'
              : `${msg.user_id?.name || ''} ${msg.user_id?.last_names || ''}`.trim() || 'Usuario'}
            - ${new Date(msg.timestamp).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        `;
        thread.appendChild(div);
      });

      textarea.value = '';
      form.style.display = 'none';

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