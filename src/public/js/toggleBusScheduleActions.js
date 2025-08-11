const customConfirm = document.getElementById('custom-confirm')
const confirmMessage = document.getElementById('confirm-message')
const btnYes = document.getElementById('confirm-yes')
const btnNo = document.getElementById('confirm-no')

let callbackOnConfirm = null

function showCustomConfirm(message, callback) {
  confirmMessage.textContent = message
  callbackOnConfirm = callback
  customConfirm.classList.remove('hidden')
}

btnYes.addEventListener('click', () => {
  customConfirm.classList.add('hidden')
  if (callbackOnConfirm) callbackOnConfirm(true)
})

btnNo.addEventListener('click', () => {
  customConfirm.classList.add('hidden')
  if (callbackOnConfirm) callbackOnConfirm(false)
})

document.querySelectorAll('.bus-schedule-action-button-delete').forEach(btn => {
  btn.addEventListener('click', () => {
    const scheduleId = btn.closest('.grid-item').dataset.id
    const destinationElement = document.querySelector(`.grid-item[data-id="${scheduleId}"][data-label="Destino"]`)
    const horarioElement = document.querySelector(`.grid-item[data-id="${scheduleId}"][data-label="Horario"]`)

    const destination = destinationElement?.textContent || 'Destino desconocido'
    const horario = horarioElement?.textContent || 'Horario desconocido'

    showCustomConfirm(`¿Querés eliminar el horario de destino "${destination}" a las ${horario}?`, confirmed => {
      if (confirmed) {
        fetch(`/api/bus-schedules/delete/${scheduleId}`, {
          method: 'DELETE'
        })
          .then(res => {
            if (!res.ok) throw new Error('Error al eliminar')
            return res.json()
          })
          .then(data => {
            location.reload()
          })
          .catch(err => {
            console.error('Error:', err)
          })
      }
    })
  })
})

let currentEditingId = null
const addNewBtn = document.getElementById('add-new-bus-schedule')

document.querySelectorAll('.bus-schedule-action-button-edit').forEach(btn => {
  btn.addEventListener('click', () => {
    const pencilIcon = btn.querySelector('#pencil-icon')
    const xIcon = btn.querySelector('#x-icon')
    const scheduleId = btn.closest('.grid-item').dataset.id
    const cells = document.querySelectorAll(`.grid-item[data-id="${scheduleId}"]`)

    const isEditing = !xIcon.classList.contains('oculto')

    if (!isEditing) {
      document.querySelectorAll('.bus-schedule-action-button-edit').forEach(otherBtn => {
        const otherPencil = otherBtn.querySelector('#pencil-icon')
        const otherX = otherBtn.querySelector('#x-icon')
        otherPencil.classList.remove('oculto')
        otherX.classList.add('oculto')
      })
      document.querySelectorAll('.bus-schedule-action-button-confirm-edit').forEach(btn => btn.classList.add('oculto'))
      document.querySelectorAll('.bus-schedule-input-edit').forEach(input => input.classList.add('oculto'))
      addNewBtn.classList.add('oculto')

      pencilIcon.classList.add('oculto')
      xIcon.classList.remove('oculto')
      document.querySelector(`.bus-schedule-action-button-confirm-edit[data-id="${scheduleId}"]`).classList.remove('oculto')

      cells.forEach(cell => {
        const input = cell.querySelector('.bus-schedule-input-edit')
        if (input) {
          const originalText = cell.firstChild.textContent.trim()
          cell.dataset.originalText = originalText
          cell.firstChild.textContent = ''
          input.classList.remove('oculto')

          switch(cell.dataset.label) {
            case 'Destino':
              input.value = originalText
              break
            case 'Horario':
              input.value = to24HourFormat(originalText)
              break
            case 'Dirección':
              input.value = originalText
              break
            case 'Precio':
              input.value = originalText.replace(/[₡\s]/g, '')
              break
            case 'Espera':
              input.value = originalText.replace(/min/g, '').trim()
              break
          }
        }
      })

      currentEditingId = scheduleId

    } else {
      pencilIcon.classList.remove('oculto')
      xIcon.classList.add('oculto')
      addNewBtn.classList.remove('oculto')

      cells.forEach(cell => {
        const input = cell.querySelector('.bus-schedule-input-edit')
        if (input) {
          input.classList.add('oculto')
          cell.firstChild.textContent = cell.dataset.originalText || ''
        }
      })

      currentEditingId = null
      document.querySelectorAll('.bus-schedule-action-button-confirm-edit').forEach(btn => btn.classList.add('oculto'))
    }
  })
})

document.querySelectorAll('.bus-schedule-action-button-confirm-edit').forEach(confirmBtn => {
  confirmBtn.addEventListener('click', async () => {
    const scheduleId = confirmBtn.closest('.grid-item[data-label="Acciones"]').dataset.id
    if (!scheduleId) return alert('No hay edición activa')

    const cells = document.querySelectorAll(`.grid-item[data-id="${scheduleId}"]`)
    const updatedData = {}

    cells.forEach(cell => {
      const input = cell.querySelector('.bus-schedule-input-edit')
      if (input) {
        switch(cell.dataset.label) {
          case 'Destino':
            updatedData.destination = input.value.trim()
            break
          case 'Horario':
            updatedData.arrival_time = input.value.trim()
            break
          case 'Dirección':
            updatedData.address = input.value.trim()
            break
          case 'Precio':
            updatedData.price = Number(input.value)
            break
          case 'Espera':
            updatedData.wait_time_minutes = Number(input.value)
            break
        }
      }
    })

    try {
      const res = await fetch(`/api/bus-schedules/edit/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (!res.ok) throw new Error('Error actualizando horario')

      await res.json()

      cells.forEach(cell => {
        const input = cell.querySelector('.bus-schedule-input-edit')
        if (input) {
          input.classList.add('oculto')

          switch(cell.dataset.label) {
            case 'Destino':
              cell.firstChild.textContent = updatedData.destination
              cell.dataset.originalText = updatedData.destination
              break
            case 'Horario':
              const formattedTime = formatTo12Hour(updatedData.arrival_time)
              cell.firstChild.textContent = formattedTime
              cell.dataset.originalText = formattedTime
              break
            case 'Dirección':
              cell.firstChild.textContent = updatedData.address
              cell.dataset.originalText = updatedData.address
              break
            case 'Precio':
              const priceText = `₡${updatedData.price}`
              cell.firstChild.textContent = priceText
              cell.dataset.originalText = priceText
              break
            case 'Espera':
              const esperaText = `${updatedData.wait_time_minutes} min`
              cell.firstChild.textContent = esperaText
              cell.dataset.originalText = esperaText
              break
          }
        }
      })

      document.querySelectorAll('.bus-schedule-action-button-edit').forEach(btn => {
        const pencilIcon = btn.querySelector('#pencil-icon')
        const xIcon = btn.querySelector('#x-icon')
        pencilIcon.classList.remove('oculto')
        xIcon.classList.add('oculto')
      })

      currentEditingId = null
      document.querySelectorAll('.bus-schedule-action-button-confirm-edit').forEach(btn => btn.classList.add('oculto'))
      addNewBtn.classList.remove('oculto')

    } catch (error) {
      console.error(error)
      alert('Error al actualizar el horario')
    }
  })
})

function to24HourFormat(time12h) {
  if (!time12h) return ''
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  if (hours === '12') hours = '00'
  if (modifier.toUpperCase() === 'PM') hours = String(parseInt(hours, 10) + 12)
  return `${hours.padStart(2, '0')}:${minutes}`
}

function formatTo12Hour(time24h) {
  if (!time24h) return ''
  const [hourStr, minuteStr] = time24h.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr
  const suffix = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${suffix}`
}