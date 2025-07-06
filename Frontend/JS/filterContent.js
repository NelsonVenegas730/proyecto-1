document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  const dateInput = document.getElementById('filter-date');
  const applyButton = document.getElementById('apply-filters');

  const tickets = document.querySelectorAll('.ticket-element');
  const noticias = document.querySelectorAll('.noticia-evento-anuncio-element');

  const items = tickets.length > 0 ? tickets : noticias;

  applyButton.addEventListener('click', () => {
    const selectedTypes = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const selectedDate = dateInput.value;

    items.forEach(item => {
      const badge = item.querySelector('.badge');
      if (!badge) {
        item.style.display = 'none';
        return;
      }
      const tipo = Array.from(badge.classList).find(c => c !== 'badge');
      const fechaEl = item.querySelector('.fecha');
      const fechaText = fechaEl ? fechaEl.textContent : '';
      const cardDate = extraerFechaISO(fechaText);

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tipo);
      const matchesDate = !selectedDate || cardDate === selectedDate;

      item.style.display = matchesType && matchesDate ? 'block' : 'none';
    });
  });

  function extraerFechaISO(textoFecha) {
    // Trata de sacar la fecha en formato yyyy-mm-dd de un texto como "Fecha de creación: 6 de julio de 2025"
    const partes = textoFecha.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
    if (!partes) return '';
    const [_, dia, mesStr, year] = partes;
    const meses = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const mes = meses[mesStr.toLowerCase()];
    return `${year}-${mes}-${dia.padStart(2, '0')}`;
  }
});
