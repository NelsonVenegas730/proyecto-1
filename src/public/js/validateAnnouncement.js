document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-anuncio')
  const tipo = document.getElementById('tipo')
  const titulo = document.getElementById('titulo')
  const descripcion = document.getElementById('descripcion')
  const imagen = document.getElementById('imagen')

  const tipoReq = document.getElementById('tipo-requisitos')
  const tituloReq = document.getElementById('titulo-requisitos')
  const descripcionReq = document.getElementById('descripcion-requisitos')

  const mensajeExito = document.getElementById('mensaje-exito')
  const mensajeError = document.getElementById('mensaje-error')

  const ocultarErrores = () => {
    tipoReq.classList.add('oculto')
    tituloReq.classList.add('oculto')
    descripcionReq.classList.add('oculto')
    mensajeError.classList.add('oculto')
    mensajeExito.classList.add('oculto')
  }

  const userInfoDiv = document.getElementById('user-info')
  const userRole = userInfoDiv ? userInfoDiv.dataset.userRole : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    ocultarErrores()

    let errores = false

    if (!tipo.value) {
      tipoReq.classList.remove('oculto')
      errores = true
    }

    if (!titulo.value.trim()) {
      tituloReq.textContent = 'El título es obligatorio'
      tituloReq.classList.remove('oculto')
      errores = true
    } else if (titulo.value.trim().length > 100) {
      tituloReq.textContent = 'El título es muy largo'
      tituloReq.classList.remove('oculto')
      errores = true
    }

    if (errores) return

    const formData = new FormData()
    formData.append('type', tipo.value)
    formData.append('title', titulo.value.trim())
    formData.append('description', descripcion.value.trim())
    if (imagen.files.length > 0) {
      formData.append('image', imagen.files[0])
    }

    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        mensajeExito.textContent = 'Anuncio creado correctamente'
        mensajeExito.classList.remove('oculto')
        setTimeout(() => {
          if (userRole === 'ciudadano') {
            window.location.href = '/noticias-anuncios-eventos'
          } else {
            window.location.reload()
          }
        }, 2000)
      } else {
        mensajeError.textContent = data.message || 'Error al crear el anuncio'
        mensajeError.classList.remove('oculto')
      }
    } catch (err) {
      console.error(err)
      mensajeError.textContent = 'Error inesperado al enviar el formulario'
      mensajeError.classList.remove('oculto')
    }
  })
})