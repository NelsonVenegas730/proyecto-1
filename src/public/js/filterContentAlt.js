const contentCheckboxes = document.querySelectorAll('.filter-content-type');
const secciones = ['pendientesEmprendimientos','pendientesNoticias','horariosBuses','allEmprendimientos','allNoticias'];

function aplicarFiltroContenido() {
  const seleccionados = Array.from(contentCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

  secciones.forEach(seccion => {
    const mostrar = seleccionados.length === 0 || seleccionados.includes(seccion);
    document.querySelectorAll(`.${seccion}`).forEach(el => {
      if(el.tagName === 'DIV') el.style.display = mostrar ? 'flex' : 'none';
      else el.style.display = mostrar ? 'block' : 'none';
    });
  });
}

contentCheckboxes.forEach(cb => cb.addEventListener('change', aplicarFiltroContenido));
aplicarFiltroContenido();
