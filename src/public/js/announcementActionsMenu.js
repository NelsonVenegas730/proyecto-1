document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.announcement-menu-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const popup = btn.nextElementSibling
      if (!popup) return

      document.querySelectorAll('.announcement-menu-popup.show').forEach(p => {
        if (p !== popup) p.classList.remove('show')
      })

      popup.classList.toggle('show')
    })
  })

  document.addEventListener('click', () => {
    document.querySelectorAll('.announcement-menu-popup.show').forEach(popup => {
      popup.classList.remove('show')
    })
  })

  document.querySelectorAll('.announcement-menu-option').forEach(option => {
    option.addEventListener('click', () => {
      const popup = option.closest('.announcement-menu-popup')
      if (popup) popup.classList.remove('show')
    })
  })
})
