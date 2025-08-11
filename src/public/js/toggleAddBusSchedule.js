const addBtn = document.getElementById('add-new-bus-schedule')
const form = document.querySelector('.bus-schedule-form')
const cancelBtn = document.getElementById('cancel-new-bus-schedule')

addBtn.addEventListener('click', () => {
  form.classList.remove('oculto')
  addBtn.classList.add('oculto')
})

cancelBtn.addEventListener('click', () => {
  form.classList.add('oculto')
  addBtn.classList.remove('oculto')
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  data.price = parseFloat(data.price)
  data.wait_time_minutes = parseInt(data.wait_time_minutes, 10)

  try {
    const res = await fetch('/api/bus-schedules/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al agregar horario')

    await res.json()

    location.reload()
  } catch (error) {
    alert(error.message)
  }
})