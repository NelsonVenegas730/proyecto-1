document.addEventListener('DOMContentLoaded', () => {
  const contentCheckboxes = document.querySelectorAll('.filter-content-type');

  const emprendimientosHeading = document.querySelector('.emprendimientos-heading');
  const emprendimientosContainer = document.querySelector('.emprendimientos-pendientes');
  const busSchedulesHeading = document.querySelector('.bus-schedule-heading');
  const busSchedulesContainer = document.querySelector('.bus-schedules');

  const noticiasHeading = document.querySelector('.noticias-heading');
  const noticiasContainer = document.querySelector('.noticias-pendientes');

  const revertContentButton = document.getElementById('revert-filters');

  function aplicarFiltroContenido() {
    const seleccionados = Array.from(contentCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const mostrarAmbos = seleccionados.length === 0 || seleccionados.length === 2;

    const mostrarEmprendimientos = mostrarAmbos || seleccionados.includes('emprendimientos');
    const mostrarNoticias = mostrarAmbos || seleccionados.includes('noticias');
    const mostrarHorariosBuses = mostrarAmbos || seleccionados.includes('horariosBuses');

    emprendimientosHeading.style.display = mostrarEmprendimientos ? 'block' : 'none';
    emprendimientosContainer.style.display = mostrarEmprendimientos ? 'flex' : 'none';

    noticiasHeading.style.display = mostrarNoticias ? 'block' : 'none';
    noticiasContainer.style.display = mostrarNoticias ? 'flex' : 'none';

    busSchedulesHeading.style.display = mostrarHorariosBuses ? 'block' : 'none';
    busSchedulesContainer.style.display = mostrarHorariosBuses ? 'grid' : 'none';
  }

  contentCheckboxes.forEach(cb => cb.addEventListener('change', aplicarFiltroContenido));

  if (revertContentButton) {
    revertContentButton.addEventListener('click', () => {
      contentCheckboxes.forEach(cb => (cb.checked = false));
      aplicarFiltroContenido();
    });
  }

  aplicarFiltroContenido();
});