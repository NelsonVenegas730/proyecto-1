const form = document.querySelector("form")
const mensajeExito = document.getElementById('mensaje-exito')
const mensajeError = document.getElementById('mensaje-error')

const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirm_password")

const requisitosPass = document.getElementById("password-requisitos")
const requisitosConfirm = document.getElementById("confirm-password-requisitos")

const validarPasswordRequisitos = () => {
  if (!password || !requisitosPass) return true
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,14}$/
  const valido = regex.test(password.value)

  requisitosPass.classList.toggle("error", !valido)
  requisitosPass.classList.toggle("ok", valido)
  requisitosPass.style.display = 'block'

  password.classList.toggle("input-correcto", valido)
  password.classList.toggle("input-incorrecto", !valido)

  return valido
}

const validarPasswordMatch = () => {
  if (!password || !confirmPassword || !requisitosConfirm) return true
  const coincide = password.value === confirmPassword.value && password.value !== ""

  requisitosConfirm.classList.toggle("error", !coincide)
  requisitosConfirm.classList.toggle("ok", coincide)
  requisitosConfirm.style.display = 'block'

  confirmPassword.classList.toggle("input-correcto", coincide)
  confirmPassword.classList.toggle("input-incorrecto", !coincide)

  return coincide
}

if (password) {
  password.addEventListener("input", () => {
    validarPasswordRequisitos()
    validarPasswordMatch()
  })
}

if (confirmPassword) {
  confirmPassword.addEventListener("input", validarPasswordMatch)
}

if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault()

    mensajeExito?.classList.add('oculto')
    mensajeError?.classList.add('oculto')

    const passValido = validarPasswordRequisitos()
    const passCoinciden = validarPasswordMatch()

    if (!passValido || !passCoinciden) {
      alert("Revisá los requisitos y que las contraseñas coincidan")
      return
    }

    const correoInput = form.querySelector("input[name='correo']")
    if (correoInput) {
      const correo = correoInput.value.trim()
      if (!correo) {
        alert("Ingresá un correo válido")
        return
      }
      try {
        const res = await fetch('/auth/password-reset/recover-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo })
        })
        const data = await res.json()
        if (res.ok) {
          mensajeExito.textContent = data.message
          mensajeExito.classList.remove('oculto')
        } else {
          mensajeError.textContent = data.error || 'Error desconocido'
          mensajeError.classList.remove('oculto')
        }
      } catch {
        mensajeError.textContent = 'Error en la conexión'
        mensajeError.classList.remove('oculto')
      }
      return
    }

    const tokenInput = form.querySelector("input[name='token']")
    const passwordInput = form.querySelector("input[name='password']")

    if (tokenInput && passwordInput) {
      try {
        const res = await fetch('/auth/password-reset/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: tokenInput.value,
            password: passwordInput.value
          })
        })

        const data = await res.json()

        if (res.ok) {
          mensajeExito.textContent = data.message
          mensajeExito.classList.remove('oculto')
          setTimeout(() => {
            window.location.href = '/auth/inicio-sesion'
          }, 2000)
        } else {
          mensajeError.textContent = data.error || 'Error al cambiar contraseña'
          mensajeError.classList.remove('oculto')
        }

      } catch {
        mensajeError.textContent = 'Error de conexión al cambiar contraseña'
        mensajeError.classList.remove('oculto')
      }

      return
    }

    form.submit()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (mensajeExito && !mensajeExito.classList.contains('oculto')) {
    setTimeout(() => {
      window.location.href = '/auth/inicio-sesion'
    }, 2000)
  }
})
