document.querySelectorAll('.status-select').forEach(select => {
  select.addEventListener('change', async (e) => {
    const selectEl = e.target
    const id = selectEl.dataset.id
    const newStatus = selectEl.value
    // Definí el type según si está dentro de emprendimiento o anuncio, por ejemplo:
    // busco el elemento padre que tenga data-type o algo similar para identificar
    const card = selectEl.closest('.emprendimiento-card, .noticia-card')
    const type = card.classList.contains('emprendimiento-card') ? 'business' : 'announcement'

    try {
      const res = await fetch('/admin/gestion-contenido/estado', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, newStatus })
      })

      if (!res.ok) throw new Error('Error al cambiar estado')

      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('No se pudo cambiar el estado')
    }
  })
})
