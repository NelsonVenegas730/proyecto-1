document.querySelectorAll('.btn-reply-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.nextElementSibling
    if (form.style.display === 'none' || !form.style.display) {
      form.style.display = 'flex'
      btn.style.display = 'none'
    }
  })
})

document.querySelectorAll('.btn-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('.reply-form')
    const toggleBtn = form.previousElementSibling
    form.style.display = 'none'
    toggleBtn.style.display = 'inline-block'
    form.querySelector('textarea').value = ''
  })
})
