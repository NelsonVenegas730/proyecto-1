document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-add-button')
  const addRow = document.getElementById('add-user-row')
  if (!toggleBtn || !addRow) return

  const mensajeExito = document.getElementById('mensaje-exito')
  const mensajeError = document.getElementById('mensaje-error')

  const mostrarMensaje = (element, callback) => {
    element.classList.remove('oculto')
    setTimeout(() => {
      element.classList.add('oculto')
      if (callback) callback()
    }, 3000)
  }

  const setText = visible => {
    toggleBtn.textContent = visible ? 'Cancelar' : 'Agregar nuevo usuario +'
    toggleBtn.setAttribute('aria-expanded', String(visible))
  }

  setText(!addRow.classList.contains('oculto'))

  toggleBtn.addEventListener('click', () => {
    const isHidden = addRow.classList.toggle('oculto')
    setText(!isHidden)
  })

  const createBtn = document.getElementById('create-user-button')
  if (!createBtn) return

  const inputs = {
    username: addRow.querySelector('input[name="username"]'),
    name: addRow.querySelector('input[name="name"]'),
    last_names: addRow.querySelector('input[name="last_names"]'),
    email: addRow.querySelector('input[name="email"]'),
    password: addRow.querySelector('input[name="password"]'),
    confirm_password: addRow.querySelector('input[id="confirm-password"]'),
    role: addRow.querySelector('select[name="role"]')
  }

  const requisitos = {
    username: document.getElementById('usuario-requisitos'),
    name: document.getElementById('nombre-requisitos'),
    last_names: document.getElementById('apellidos-requisitos'),
    email: document.getElementById('correo-requisitos'),
    password: document.getElementById('password-requisitos'),
    confirm_password: document.getElementById('confirm-password-requisitos')
  }

  const expresiones = {
    username: /^[a-zA-Z0-9_-]{3,20}$/,
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    last_names: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,14}$/
  }

  const validarCampo = (input, expresion, requisitoElement) => {
    const valido = expresion.test(input.value)
    input.classList.toggle('input-correcto', valido)
    input.classList.toggle('input-incorrecto', !valido)
    requisitoElement.classList.toggle('ok', valido)
    requisitoElement.classList.toggle('error', !valido)
    return valido
  }

  const validarPasswordMatch = () => {
    const coincide = inputs.password.value === inputs.confirm_password.value && inputs.confirm_password.value !== ''
    inputs.confirm_password.classList.toggle('input-correcto', coincide)
    inputs.confirm_password.classList.toggle('input-incorrecto', !coincide)
    requisitos.confirm_password.classList.toggle('ok', coincide)
    requisitos.confirm_password.classList.toggle('error', !coincide)
    return coincide
  }

  inputs.username.addEventListener('input', () => validarCampo(inputs.username, expresiones.username, requisitos.username))
  inputs.name.addEventListener('input', () => validarCampo(inputs.name, expresiones.name, requisitos.name))
  inputs.last_names.addEventListener('input', () => validarCampo(inputs.last_names, expresiones.last_names, requisitos.last_names))
  inputs.email.addEventListener('input', () => validarCampo(inputs.email, expresiones.email, requisitos.email))
  inputs.password.addEventListener('input', () => {
    validarCampo(inputs.password, expresiones.password, requisitos.password)
    validarPasswordMatch()
  })
  inputs.confirm_password.addEventListener('input', validarPasswordMatch)

  createBtn.addEventListener('click', async e => {
    e.preventDefault()

    const validoUsername = validarCampo(inputs.username, expresiones.username, requisitos.username)
    const validoName = validarCampo(inputs.name, expresiones.name, requisitos.name)
    const validoLastNames = validarCampo(inputs.last_names, expresiones.last_names, requisitos.last_names)
    const validoEmail = validarCampo(inputs.email, expresiones.email, requisitos.email)
    const validoPassword = validarCampo(inputs.password, expresiones.password, requisitos.password)
    const validoConfirmPassword = validarPasswordMatch()
    const roleValido = inputs.role.value !== ''

    if (!validoUsername || !validoName || !validoLastNames || !validoEmail || !validoPassword || !validoConfirmPassword || !roleValido) {
      mostrarMensaje(mensajeError)
      return
    }

    const data = {
      username: inputs.username.value.trim(),
      name: inputs.name.value.trim(),
      last_names: inputs.last_names.value.trim(),
      email: inputs.email.value.trim(),
      password: inputs.password.value,
      role: inputs.role.value
    }

    try {
      const res = await fetch('/auth/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error('Error al crear usuario')

      mostrarMensaje(mensajeExito, () => location.reload())

      Object.values(inputs).forEach(input => {
        if (input.tagName === 'SELECT') {
          input.value = ''
        } else {
          input.value = ''
          input.classList.remove('input-correcto', 'input-incorrecto')
        }
      })
      Object.values(requisitos).forEach(req => {
        req.classList.remove('ok', 'error')
      })
    } catch (error) {
      mensajeError.textContent = error.message || 'Error al crear usuario'
      mostrarMensaje(mensajeError)
    }
  })
})
