const ellipsisBtns = document.querySelectorAll('.ellipsis-btn')
const popups = document.querySelectorAll('.status-popup')

ellipsisBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation()
    closeAllPopups()
    const popup = btn.nextElementSibling
    popup.style.display = 'flex'
  })
})

document.body.addEventListener('click', () => {
  closeAllPopups()
})

function closeAllPopups() {
  popups.forEach(p => p.style.display = 'none')
}

popups.forEach(popup => {
  popup.addEventListener('click', e => e.stopPropagation())
  popup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      const newStatus = btn.dataset.status
      const card = popup.closest('.ticket-card')
      const badge = card.querySelector('.status-badge')
      badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
      badge.className = `status-badge ${newStatus}`
      popup.style.display = 'none'
    })
  })
})

document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.nextElementSibling
    box.style.display = box.style.display === 'none' ? 'flex' : 'none'
  })
})

document.querySelectorAll('.cancel-reply-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.reply-box')
    box.style.display = 'none'
    const textarea = box.querySelector('.reply-textarea')
    textarea.value = ''
  })
})

document.querySelectorAll('.send-reply-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const textarea = btn.previousElementSibling
    const content = textarea.value.trim()
    if (content) {
      console.log('Respuesta enviada:', content)
      textarea.value = ''
      btn.closest('.reply-box').style.display = 'none'
      alert('Respuesta enviada al ciudadano.')
    }
  })
})

