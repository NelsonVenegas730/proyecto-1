document.querySelectorAll('.ellipsis-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation()
    const popup = btn.nextElementSibling
    const isVisible = popup.style.display === 'block'

    // Cerrar todos los popups abiertos menos el actual
    document.querySelectorAll('.action-popup').forEach(p => {
      if (p !== popup) p.style.display = 'none'
    })

    popup.style.display = isVisible ? 'none' : 'block'
  })
})

// Cerrar popup si se hace click afuera
document.addEventListener('click', () => {
  document.querySelectorAll('.action-popup').forEach(p => p.style.display = 'none')
})