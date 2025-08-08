const formularioPerfil = document.getElementById("formulario-perfil");
const formularioSeguridad = document.getElementById("formulario-seguridad");

const usuario = document.getElementById("usuario");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const requisitosUsuario = document.getElementById("usuario-requisitos");
const requisitosNombre = document.getElementById("nombre-requisitos");
const requisitosApellidos = document.getElementById("apellidos-requisitos");
const requisitosCorreo = document.getElementById("correo-requisitos");
const requisitosPassword = document.getElementById("password-requisitos");
const requisitosConfirmPassword = document.getElementById("confirm-password-requisitos");

const mensajeExito = document.getElementById("mensaje-exito");
const mensajeError = document.getElementById("mensaje-error");

const btnEditarCuenta = document.getElementById("btn-editar-cuenta");
const accountInfo = document.getElementById("account-info");
const inputsAccount = accountInfo ? accountInfo.querySelectorAll("input") : [];

const expresiones = {
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,14}$/,
    soloTexto: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    usuario: /^[a-zA-Z0-9_-]{3,20}$/,
};

let editMode = false;

const validarCampo = (input, expresion, requisitosElement) => {
    if (!input || !input.value) return true;
    
    const valor = input.value || ''; // Fallback a string vacío
    
    if (!valor.trim()) {
        input.classList.add("input-incorrecto");
        input.classList.remove("input-correcto");
        requisitosElement?.classList.add("error");
        requisitosElement?.classList.remove("ok");
        return false;
    }
    
    const valido = expresion.test(valor);
    input.classList.toggle("input-correcto", valido);
    input.classList.toggle("input-incorrecto", !valido);
    requisitosElement?.classList.toggle("ok", valido);
    requisitosElement?.classList.toggle("error", !valido);
    return valido;
};

const validarPasswordMatch = () => {
    if (!password?.value && !confirmPassword?.value) return true;
    const coincide = password.value === confirmPassword.value;
    confirmPassword.classList.toggle("input-correcto", coincide);
    confirmPassword.classList.toggle("input-incorrecto", !coincide);
    requisitosConfirmPassword?.classList.toggle("ok", coincide);
    requisitosConfirmPassword?.classList.toggle("error", !coincide);
    return coincide;
};

const cancelChangesBtn = document.getElementById("cancel-changes");
if (cancelChangesBtn) {
    cancelChangesBtn.addEventListener("click", () => location.reload());
}
if (usuario) usuario.addEventListener("input", () => validarCampo(usuario, expresiones.usuario, requisitosUsuario));
if (nombre) nombre.addEventListener("input", () => validarCampo(nombre, expresiones.soloTexto, requisitosNombre));
if (apellidos) apellidos.addEventListener("input", () => validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos));

if (correo) correo.addEventListener("input", () => validarCampo(correo, expresiones.correo, requisitosCorreo));
if (password) {
  password.addEventListener("input", () => {
    validarCampo(password, expresiones.password, requisitosPassword);
    validarPasswordMatch();
  });
}
if (confirmPassword) confirmPassword.addEventListener("input", validarPasswordMatch);

if (btnEditarCuenta && accountInfo) {
    btnEditarCuenta.addEventListener("click", () => {
        editMode = !editMode;
        accountInfo.classList.toggle("disabled", !editMode);
        inputsAccount.forEach(input => {
            input.disabled = !editMode;
        });
    });
}

if (formularioPerfil) {
    formularioPerfil.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuarioValido = usuario ? validarCampo(usuario, expresiones.usuario, requisitosUsuario) : true;
        const nombreValido = nombre ? validarCampo(nombre, expresiones.soloTexto, requisitosNombre) : true;
        const apellidosValido = apellidos ? validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos) : true;

        if (usuarioValido && nombreValido && apellidosValido) {
            try {
                const res = await fetch("/auth/update-profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: (usuario?.value ?? '').trim(),
                        name: (nombre?.value ?? '').trim(),
                        last_names: (apellidos?.value ?? '').trim()
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    mensajeExito.textContent = data.message || "Datos actualizados correctamente";
                    mensajeExito.classList.remove("oculto");

                    setTimeout(() => {
                        mensajeExito.classList.add("oculto");
                        location.reload();
                    }, 2000);
                } else {
                    throw new Error(data.error || "Error al actualizar");
                }
            } catch (err) {
                mensajeError.textContent = err.message;
                mensajeError.classList.remove("oculto");
                setTimeout(() => {
                    mensajeError.classList.add("oculto");
                }, 3000);
            }
        } else {
            mensajeError.textContent = "Corrige los campos marcados antes de guardar";
            mensajeError.classList.remove("oculto");
            setTimeout(() => {
                mensajeError.classList.add("oculto");
            }, 3000);
        }
    });
}

if (formularioSeguridad) {
  formularioSeguridad.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correoValido = correo ? validarCampo(correo, expresiones.correo, requisitosCorreo) : true;
    const passwordValido = password ? validarCampo(password, expresiones.password, requisitosPassword) : true;
    const confirmValido = validarPasswordMatch();

    if (!correoValido || !passwordValido || !confirmValido) {
      mensajeError.textContent = "Corrige los campos marcados antes de guardar";
      mensajeError.classList.remove("oculto");
      setTimeout(() => {
        mensajeError.classList.add("oculto");
      }, 3000);
      return;
    }

    try {
      const res = await fetch("/auth/update-sensitive", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo.value.trim(),
          password: password.value.trim()
        }),
      });

      const data = await res.json();

      if (res.ok) {
        mensajeExito.textContent = data.message || "Información sensible actualizada";
        mensajeExito.classList.remove("oculto");
        setTimeout(() => {
          mensajeExito.classList.add("oculto");
          location.reload();
        }, 2000);
      } else {
        throw new Error(data.error || "Error al actualizar información");
      }
    } catch (err) {
      mensajeError.textContent = err.message;
      mensajeError.classList.remove("oculto");
      setTimeout(() => {
        mensajeError.classList.add("oculto");
      }, 3000);
    }
  });
}

const inputAvatar = document.getElementById('image');
const btnUploadAvatar = document.getElementById('btn-upload-avatar');
const preview = document.getElementById('preview-img');

inputAvatar.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    btnUploadAvatar.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
    btnUploadAvatar.style.display = "none";
  }
});

btnUploadAvatar.addEventListener("click", async () => {
  if (inputAvatar.files.length === 0) return;

  const formData = new FormData();
  formData.append("avatar", inputAvatar.files[0]);

  try {
    const res = await fetch("/auth/update-avatar", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      mensajeExito.textContent = data.message || "Avatar actualizado correctamente";
      mensajeExito.classList.remove("oculto");
      preview.src = data.avatarUrl;
      preview.style.display = "block";
      btnUploadAvatar.style.display = "none";
      inputAvatar.value = "";
      setTimeout(() => {
        mensajeExito.classList.add("oculto");
        location.reload();
      }, 1000);
    } else {
      throw new Error(data.error || "Error al actualizar avatar");
    }
  } catch (err) {
    mensajeError.textContent = err.message;
    mensajeError.classList.remove("oculto");
    setTimeout(() => {
      mensajeError.classList.add("oculto");
    }, 3000);
  }
});

const btnRemoveAvatar = document.getElementById('btn-remove-avatar');

btnRemoveAvatar.addEventListener("click", async () => {
  try {
    const res = await fetch("/auth/remove-avatar", {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      mensajeExito.textContent = data.message || "Avatar eliminado correctamente";
      mensajeExito.classList.remove("oculto");
      preview.src = "";
      btnRemoveAvatar.style.display = "none";
      setTimeout(() => {
        mensajeExito.classList.add("oculto");
        location.reload();
      }, 100);
    } else {
      throw new Error(data.error || "Error al eliminar avatar");
    }
  } catch (err) {
    mensajeError.textContent = err.message;
    mensajeError.classList.remove("oculto");
    setTimeout(() => {
      mensajeError.classList.add("oculto");
    }, 3000);
  }
});