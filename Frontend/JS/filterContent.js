document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  const dateInput = document.getElementById('filter-date');
  const applyButton = document.getElementById('apply-filters');
  const cards = document.querySelectorAll('#card');

  applyButton.addEventListener('click', () => {
    const selectedTypes = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const selectedDate = dateInput.value;

    cards.forEach(card => {
      const badge = card.querySelector('.badge');
      const tipo = Array.from(badge.classList).find(c => c !== 'badge');
      const fechaText = card.querySelector('.fecha').textContent;
      const cardDate = extraerFechaISO(fechaText);

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tipo);
      const matchesDate = !selectedDate || cardDate === selectedDate;

      card.style.display = matchesType && matchesDate ? 'flex' : 'none';
    });
  });

  function extraerFechaISO(textoFecha) {
    const partes = textoFecha.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
    if (!partes) return '';
    const [_, dia, mesStr, anio] = partes;
    const meses = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const mes = meses[mesStr.toLowerCase()];
    return `${anio}-${mes}-${dia.padStart(2, '0')}`;
  }
});
