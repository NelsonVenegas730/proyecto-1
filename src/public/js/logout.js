document.getElementById('close-sesion-button').addEventListener('click', async () => {
  try {
    const res = await fetch('/auth/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/auth/inicio-sesion';
    } else {
      alert('Error al cerrar sesión');
    }
  } catch {
    alert('Error en la conexión');
  }
});
