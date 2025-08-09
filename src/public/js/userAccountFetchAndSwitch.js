document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const accountButtons = dropdownMenu ? dropdownMenu.querySelectorAll('.account-switch-btn') : [];

  if (!dropdownToggle || !dropdownMenu) return;

  dropdownToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('oculto');
  });

  accountButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const accountId = btn.getAttribute('data-id');
      if (!accountId) return;

      try {
        console.log(accountId);
        const res = await fetch('/auth/accounts/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountId }),
        });

        if (!res.ok) throw new Error('Error al cambiar de cuenta');

        const data = await res.json();

        const role = data.user.role;
        const id = data.user._id;

        if (role === 'administrador') {
          window.location.href = '/admin/panel-administrador';
        } else if (role === 'emprendedor') {
          window.location.href = `/emprendedor/mi-emprendimiento/${id}`;
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        alert(err.message || 'No se pudo cambiar de cuenta');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add('oculto');
    }
  });
});